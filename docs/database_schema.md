# LocalLens Database Schema

Database: PostgreSQL 15 + PostGIS 3.3 (Docker).

## Quick start

```bash
docker compose up -d                      # starts Postgres (5432) and Adminer (8081)
cd server && cp .env.example .env         # then set JWT_SECRET
npm install
npm run db:init                           # re-runs init.sql (safe to repeat)
```

Load sample data (run from the project root):

```powershell
Get-Content server\database\seeds\seed.sql -Raw | docker exec -i local_lens_postgres psql -U postgres -d local_lens_db
```

- Connection: `localhost:5432`, db `local_lens_db`, user `postgres`, password `postgrespassword`
- Adminer (web UI): http://localhost:8081 (System: PostgreSQL, Server: `postgres`)
- Full reset (deletes all data): `docker compose down -v` then `docker compose up -d`

`init.sql` runs automatically only the first time the Docker volume is created. After that, use `npm run db:init`.

## Enums

| Enum | Values |
|---|---|
| `user_role` | `USER`, `MODERATOR` |
| `post_category` | `ALERT`, `TRAFFIC`, `NEWS`, `EVENT`, `ANNOUNCEMENT`, `LOST_FOUND`, `COMMUNITY` |
| `post_status` | `ACTIVE`, `PENDING_REVIEW`, `FLAGGED`, `REMOVED` |
| `report_reason` | `SPAM`, `MISINFORMATION`, `HARASSMENT`, `HATE_SPEECH`, `INAPPROPRIATE_CONTENT`, `OUTDATED_INFO`, `OTHER` |
| `report_status` | `PENDING`, `RESOLVED_REMOVED`, `RESOLVED_DISMISSED` |
| `verification_vote` | `CONFIRM`, `REJECT`, `NOT_SEEN` |

There is no `ADMIN` role. `MODERATOR` is the highest role. Moderators are created only through SQL:

```sql
UPDATE users SET role = 'MODERATOR' WHERE email = 'someone@example.com';
```

## Tables

### users
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | auto-generated |
| name | VARCHAR(100) | required |
| email | VARCHAR(255) | unique, required |
| password_hash | VARCHAR(255) | bcrypt hash, never returned by the API |
| role | user_role | default `USER` |
| reputation_score | INT | default 50, must be 0 to 100 |
| is_verified | BOOLEAN | default false |
| created_at, updated_at | TIMESTAMPTZ | `updated_at` is automatic (trigger) |

### posts
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID FK users | `ON DELETE CASCADE` |
| title | VARCHAR(200) | |
| content | TEXT | |
| category | post_category | |
| location | GEOGRAPHY(Point, 4326) | **never send raw coordinates to clients** |
| locality_name | VARCHAR(150) | display name only |
| image_url | TEXT | Cloudinary URL |
| status | post_status | default `ACTIVE` |
| expires_at | TIMESTAMPTZ | set by the backend from the category TTL |
| confirmations_count | INT | default 0 (not auto-synced yet) |
| reports_count | INT | default 0, maintained by trigger |
| created_at, updated_at | TIMESTAMPTZ | `updated_at` is automatic |

### reports
One row per user report. `UNIQUE (post_id, reporter_id)` means a user can report a post only once. Columns: `id`, `post_id`, `reporter_id`, `reason`, `description`, `status` (default `PENDING`), `reviewed_by`, `reviewed_at`, `created_at`. Both `post_id` and `reporter_id` cascade on delete.

### post_verifications
Community votes (Release 2.5). `UNIQUE (post_id, user_id)`. Columns: `id`, `post_id`, `user_id`, `vote`, `created_at`.

## Indexes

| Index | On | Purpose |
|---|---|---|
| `idx_posts_location` | `posts` GIST(location) | fast radius queries (`ST_DWithin`) |
| `idx_posts_status_created` | `posts(status, created_at DESC)` | feed filter and ordering |
| `idx_posts_category` | `posts(category)` | category filter |
| `idx_posts_expires_at` | `posts(expires_at)` | expiry filter |
| `idx_posts_user_id` | `posts(user_id)` | "my posts", cascade deletes |
| `idx_users_email` | `users(email)` | login lookup |
| `idx_reports_status` | `reports(status)` | moderator queue |
| `idx_post_verifications_post` | `post_verifications(post_id)` | verification counts |

**Benchmark:** 10,000 posts, 5 km radius query: the plan used a Bitmap Index Scan on `idx_posts_location`, with an execution time of about 8.6 ms on the first (cold) run.

## Triggers (handled by the database)

1. **Auto-flag (`trg_report_inserted`)**: after every insert into `reports`, `posts.reports_count` goes up by 1. When an `ACTIVE` post reaches 3 reports, its status becomes `FLAGGED` automatically.
2. **`updated_at` (`trg_users_updated_at`, `trg_posts_updated_at`)**: `updated_at` is set on every UPDATE of `users` and `posts`.
3. Reset on approve (trg_posts_reset_reports): when a post changes from FLAGGED to ACTIVE, reports_count goes back to 0 and pending reports are dismissed.

## Notes for the backend (Ayush)

- You do **not** need to count reports or flag posts in code. Just insert into `reports`. A duplicate report throws a unique-violation error (Postgres code `23505`), so return a friendly 409.
- You do **not** need to set `updated_at` in your queries.
- The feed shows a post only if `status = 'ACTIVE'` and `expires_at` is null or in the future. Flagged, removed and expired posts are hidden.
Approving a flagged post (setting status = 'ACTIVE') automatically resets reports_count to 0 and marks its pending reports as RESOLVED_DISMISSED. You only need to set reviewed_by yourself if you want to record which moderator approved it.
- The trigger only counts reports going up. If you delete a report, adjust `reports_count` yourself.
- `confirmations_count` is not synced by a trigger yet. Do it in code, or ask Bhumika to add a trigger in Release 2.5.
- PostGIS takes **longitude first**: `ST_MakePoint(longitude, latitude)`.
- Return `distance_km` to clients, never the stored coordinates.

## Seed data

All seed users share the password `Password@123`.

| Email | Role |
|---|---|
| mod@seed.locallens.dev | MODERATOR |
| aarav@seed.locallens.dev | USER |
| meera@seed.locallens.dev | USER |
| kabir@seed.locallens.dev | USER |
| riya@seed.locallens.dev | USER |

The seed adds 15 posts around Dehradun in every category, including:
- 1 **expired** post (title starts with `Expired:`), which must never appear in the feed
- 1 **flagged** post (title starts with `Flagged:`), which must be hidden from the feed

Re-running `seed.sql` is safe: it deletes old seed users (and their posts) first.
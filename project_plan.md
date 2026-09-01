# Hyperlocal News & Community Bulletin Platform — Project Plan

## 📌 Project Overview

### Project Name
**LocalLens (Hyperlocal News & Community Bulletin)**

### Description
The Hyperlocal News & Community Bulletin Platform is a location-based application that allows users to discover, post, and interact with verified local information within a customizable **5–10 km radius**.

Unlike traditional news platforms that aggregate information from entire cities, states, or countries, this platform focuses specifically on what is happening **around the user's immediate vicinity**.

Users can post and discover:
- 📰 Local News
- 🚨 Emergency Alerts
- 📅 Local Events
- 📢 Community Announcements
- 🚧 Traffic & Road Hazard Updates
- 🐾 Lost & Found Notices
- 🏘️ Neighborhood Updates

The primary objective is to create a **real-time, location-aware, privacy-preserving community information network**.

---

# 🎯 Main Objective

Build a platform where:
> **A user can post a local update, and all users within a selected 5–10 km radius can discover that update in real-time through an optimized hyperlocal feed.**

The platform leverages:
- Browser Geolocation with privacy protection & manual fallback
- Geospatial database indexing and queries (**PostgreSQL + PostGIS**)
- Real-time geofenced messaging (**Socket.IO with Geohash room partitioning**)
- Multi-tiered content moderation & reporting
- Community confirmation & reputation scoring
- AI-assisted verification (for later releases)

---

# 🏗️ Development & Release Strategy

The project follows a phased **MVP-first approach** grouped into four clear release milestones:

```text
┌─────────────────────────────────────────────────────────────┐
│  RELEASE 1.0 — CORE MVP                                     │
│  Phase 1 (Setup) ➔ Phase 2 (Auth) ➔ Phase 3 (Geo) ➔        │
│  Phase 4 (Posts) ➔ Phase 5 (Feed) ➔ Phase 6 (UI) ➔          │
│  Phase 7 (Reports) ➔ Phase 8 (Moderation)                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  RELEASE 2.0 — REAL-TIME, MAPS & NOTIFICATIONS              │
│  Phase 9 (Real-Time WebSockets) ➔ Phase 10 (Push Alerts) ➔  │
│  Phase 16 (Interactive Leaflet Map)                         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  RELEASE 2.5 — COMMUNITY VERIFICATION & TRUST               │
│  Phase 14 (Crowd Verification) ➔ Phase 15 (Reputation) ➔    │
│  Phase 17 (Analytics Dashboard)                             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  RELEASE 3.0 — AI MODERATION & MEDIA VERIFICATION           │
│  Phase 11 (AI Content Moderation) ➔                         │
│  Phase 12 (Deepfake/Media Analysis) ➔                       │
│  Phase 13 (Misinformation Verification)                     │
└─────────────────────────────────────────────────────────────┘
```

---

# ⭐ MVP Scope (Release 1.0)

The first working version must include:
- [ ] User registration, login, and JWT-based authentication
- [ ] Role-Based Access Control (`USER`, `MODERATOR`, `ADMIN`)
- [ ] Geolocation detection with permission handling & manual locality fallback
- [ ] 5 km & 10 km radius toggle
- [ ] Location-tagged post creation with category tagging
- [ ] Hyperlocal feed powered by PostGIS spatial queries (`ST_DWithin`)
- [ ] Feed pagination (cursor/page-based) and category filtering
- [ ] User reporting system for suspicious/inappropriate posts
- [ ] Basic Moderator Dashboard to review flagged posts and reports

---

# 🛠️ Technology Stack

## Frontend
- **Framework**: React 18+ (with Vite)
- **Styling**: Vanilla CSS / Modern CSS Design Tokens (Responsive, Glassmorphism, Dark/Light theme)
- **State Management & Caching**: TanStack Query (React Query) for server state & caching
- **Routing**: React Router v6
- **HTTP Client**: Axios (with global auth interceptors)
- **Icons**: Lucide React
- **Mapping (Release 2.0)**: Leaflet & React-Leaflet (OpenStreetMap)

## Backend
- **Runtime & Framework**: Node.js & Express.js (REST APIs)
- **Architecture**: Modular Monolith (domain-separated modules)
- **Validation**: Joi / Zod schema validation
- **Security**: Helmet, CORS, Express-Rate-Limit, BCrypt

## Database & Geospatial Engine
- **Database**: PostgreSQL (v14+)
- **Spatial Extension**: **PostGIS**
- **Spatial Data Type**: `GEOGRAPHY(Point, 4326)` for accurate ellipsoidal meter/kilometer calculations
- **Spatial Index**: GIST Index (`CREATE INDEX ON posts USING GIST(location)`)
- **ORM / Query Builder**: Prisma / Knex.js / `pg` with raw spatial queries

## Authentication & Security
- **Auth**: Stateless JWT (Access + Refresh Token mechanism)
- **Password Hashing**: `bcryptjs` (salt rounds: 10+)
- **Route Guards**: Express role-based auth middleware
- **Privacy Layer**: Post location coordinate obfuscation (returning `distance_km` rather than exact author coordinates)

## Real-Time & Communications (Release 2.0)
- **WebSockets**: Socket.IO with **Geohash-based spatial rooms**
- **Push Notifications**: Firebase Cloud Messaging (FCM) / Web Push API

## AI & Verification (Release 3.0)
- **Text Moderation**: OpenAI Moderation API / Gemini API
- **Media & Deepfake Analysis**: Cloud Vision API / Specialized media verification microservice

---

# 📁 Project Structure

```text
local-lens/
│
├── client/                               # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/                       # Static media, icons
│   │   ├── components/                   # Reusable UI components
│   │   │   ├── common/                   # Buttons, Inputs, Modals, Badges
│   │   │   ├── feed/                     # PostCard, FeedList, RadiusFilter
│   │   │   ├── layout/                   # Navbar, Sidebar, Footer
│   │   │   └── moderation/               # ReportModal, ModControls
│   │   ├── context/                      # AuthContext, LocationContext
│   │   ├── hooks/                        # useLocation, useNearbyFeed, useSocket
│   │   ├── pages/                        # Landing, Login, Register, Feed, CreatePost, PostDetails, ModDashboard, Profile
│   │   ├── services/                     # api.js, authService, postService, reportService
│   │   ├── styles/                       # index.css, variables.css, theme.css
│   │   ├── utils/                        # formatters, geohash, constants
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                               # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/                       # DB, PostGIS, JWT, Environment
│   │   ├── middleware/                   # authMiddleware, roleMiddleware, rateLimiter, errorHandler
│   │   ├── modules/
│   │   │   ├── auth/                     # auth.controller, auth.service, auth.routes, auth.validation
│   │   │   ├── users/                    # user.controller, user.service, user.routes
│   │   │   ├── posts/                    # post.controller, post.service, post.routes, post.model
│   │   │   ├── feed/                     # feed.controller, feed.service, feed.routes (PostGIS queries)
│   │   │   ├── reports/                  # report.controller, report.service, report.routes
│   │   │   ├── moderation/               # moderation.controller, moderation.service, moderation.routes
│   │   │   └── verifications/            # verification.controller, verification.service
│   │   ├── sockets/                      # socketHandler, geoRoomManager
│   │   ├── utils/                        # distanceCalculator, geohasher, responseFormatter
│   │   └── app.js                        # Express app & route registration
│   ├── database/
│   │   ├── migrations/                   # SQL migration scripts with PostGIS setup
│   │   └── seeds/                        # Sample users & localized mock posts
│   ├── .env.example
│   ├── package.json
│   └── server.js                         # Server entrypoint & HTTP/Socket listener
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   └── DATABASE_SCHEMA.md
│
├── project_plan.md
├── README.md
└── .gitignore
```

---

# 👨‍💻 PHASE 1 — Project Setup & Environment

## Goal
Set up a clean, scalable monorepo development environment with frontend, backend, PostgreSQL database, and PostGIS extension.

### Tasks
- [ ] Initialize Git repository with proper `.gitignore`
- [ ] Initialize `client/` using Vite + React
- [ ] Initialize `server/` with Express.js, nodemon, and basic healthcheck route (`GET /api/health`)
- [ ] Set up PostgreSQL instance with PostGIS enabled (`CREATE EXTENSION IF NOT EXISTS postgis;`)
- [ ] Set up database migration tooling (`node-pg-migrate` or Prisma)
- [ ] Configure environment variables (`.env.example` on server and client)
- [ ] Verify client-to-server proxy / CORS connectivity

### Milestone
✅ Frontend and Backend both run concurrently, connecting to a PostGIS-enabled database with verified healthcheck.

---

# 🔐 PHASE 2 — Authentication & Authorization System

## Goal
Implement secure JWT-based authentication with role-based access control (`USER`, `MODERATOR`, `ADMIN`).

### User Database Schema
```sql
CREATE TYPE user_role AS ENUM ('USER', 'MODERATOR', 'ADMIN');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'USER',
    reputation_score INT DEFAULT 50 CHECK (reputation_score BETWEEN 0 AND 100),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### Authentication APIs
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |
| `GET` | `/api/auth/me` | Return currently authenticated user profile | Yes |
| `POST` | `/api/auth/logout` | Invalidate token/clear session cookie | Yes |

### Tasks
- [ ] Implement password hashing using `bcryptjs`
- [ ] Implement JWT generation and `authMiddleware`
- [ ] Implement `roleMiddleware(['MODERATOR', 'ADMIN'])` for protected routes
- [ ] Build client-side `AuthContext` with persistent login state

### Milestone
✅ Users can register, log in, view their profile, and receive role-specific permissions.

---

# 📍 PHASE 3 — Geolocation & Privacy System

## Goal
Accurately acquire user location with permission management, privacy protection, and a manual location search fallback.

### Geolocation Strategy
1. **Primary**: Browser HTML5 Geolocation API (`navigator.geolocation.getCurrentPosition`)
2. **Fallback on Denial**: When permission is denied (`code 1: PERMISSION_DENIED`), the UI prompts for a manual locality/neighborhood/pincode search via an OpenStreetMap Nominatim search or preset local zones.

```javascript
// Client location state structure
{
  latitude: 28.6139,
  longitude: 77.2090,
  localityName: "Connaught Place, New Delhi",
  isFallback: false,
  selectedRadiusKm: 5 // Default 5 km, toggleable to 10 km
}
```

### Privacy & Anti-Doxxing Protection
- **No Coordinate Leakage**: The public API **never** sends exact GPS coordinates of users or post creators to other clients.
- **Distance Calculation**: The backend calculates the relative distance (e.g., `1.4 km away`) using PostGIS before sending the post to the frontend.
- **Location Obfuscation**: The post location is stored internally, but displayed only as an approximate neighborhood/zone name + relative distance.

### Tasks
- [ ] Build `useLocation` custom hook in React
- [ ] Handle geolocation permission states: `prompt`, `granted`, `denied`, `unavailable`
- [ ] Create manual locality selection modal for users who deny location access
- [ ] Implement radius switcher (`5 km` / `10 km`) stored in `LocationContext`

### Milestone
✅ Application retrieves valid coordinates or fallback locality, dynamically updating the current radius context.

---

# 📰 PHASE 4 — Posts System & PostGIS Storage

## Goal
Allow authenticated users to create, view, edit, and delete location-tagged community posts with expiration lifetimes (TTL).

### Post Categories & Default Expirations
- `ALERT` — Emergency / urgent events (TTL: 24 hours)
- `TRAFFIC` — Traffic jams / road diversions (TTL: 12 hours)
- `NEWS` — Local reporting (TTL: 7 days)
- `EVENT` — Local community gatherings (TTL: until event date + 1 day)
- `ANNOUNCEMENT` — Public / municipal notices (TTL: 14 days)
- `LOST_FOUND` — Lost pets, items (TTL: 30 days)
- `COMMUNITY` — General neighborhood discussion (TTL: 14 days)

### Database Schema (PostGIS)
```sql
CREATE TYPE post_category AS ENUM (
    'ALERT', 'TRAFFIC', 'NEWS', 'EVENT', 
    'ANNOUNCEMENT', 'LOST_FOUND', 'COMMUNITY'
);

CREATE TYPE post_status AS ENUM ('ACTIVE', 'PENDING_REVIEW', 'FLAGGED', 'REMOVED');

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category post_category NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    locality_name VARCHAR(150),
    image_url TEXT,
    status post_status DEFAULT 'ACTIVE',
    expires_at TIMESTAMP WITH TIME ZONE,
    confirmations_count INT DEFAULT 0,
    reports_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crucial Spatial Index for Fast Radius Queries
CREATE INDEX idx_posts_location ON posts USING GIST(location);
CREATE INDEX idx_posts_status_created ON posts(status, created_at DESC);
CREATE INDEX idx_posts_category ON posts(category);
```

### Posts CRUD APIs
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/posts` | Create new location-tagged post | Yes |
| `GET` | `/api/posts/:id` | Get single post details with computed distance | Optional |
| `PUT` | `/api/posts/:id` | Edit own post | Yes (Owner) |
| `DELETE` | `/api/posts/:id` | Delete own post | Yes (Owner/Admin) |
| `GET` | `/api/posts/me` | Fetch posts created by current user | Yes |

### Tasks
- [ ] Create PostGIS table migration and GIST spatial index
- [ ] Build `POST /api/posts` with automatic Point conversion: `ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography`
- [ ] Implement automatic `expires_at` calculation based on category
- [ ] Implement input validation (title length, content sanitization)

### Milestone
✅ Users can create posts tagged with geographical coordinates and persist them into PostGIS.

---

# 📡 PHASE 5 — Hyperlocal Nearby Feed (Core Engine) ⭐

## Goal
Implement the core geospatial feed query that fetches active, non-expired posts within the user's selected radius (5 km or 10 km), with pagination and category filtering.

### PostGIS Query Logic
```sql
SELECT 
    p.id,
    p.user_id,
    u.name AS author_name,
    u.reputation_score AS author_reputation,
    p.title,
    p.content,
    p.category,
    p.locality_name,
    p.image_url,
    p.status,
    p.confirmations_count,
    p.created_at,
    p.expires_at,
    ROUND((ST_Distance(p.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography))::numeric, 0) AS distance_meters,
    ROUND((ST_Distance(p.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) / 1000.0)::numeric, 1) AS distance_km
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE 
    p.status = 'ACTIVE'
    AND (p.expires_at IS NULL OR p.expires_at > CURRENT_TIMESTAMP)
    AND ST_DWithin(p.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
    AND ($4::post_category[] IS NULL OR p.category = ANY($4))
ORDER BY 
    CASE WHEN p.category = 'ALERT' THEN 0 ELSE 1 END,
    p.created_at DESC
LIMIT $5 OFFSET $6;
```
*Parameters:*
`$1`: Longitude (float), `$2`: Latitude (float), `$3`: Radius in meters (e.g. 5000 or 10000), `$4`: Category array filter, `$5`: Limit (default 20), `$6`: Offset.

### Hyperlocal Feed API
```text
GET /api/feed/nearby?lat=28.6139&lng=77.2090&radius=5&category=ALERT,NEWS&page=1&limit=20
```

### Feed Ranking Algorithm (Release 1.0)
1. **Urgency Weight**: `ALERT` posts pinned to top of feed for their active duration.
2. **Recency**: Chronological ordering for standard posts.
3. **Proximity**: Clear indicator of distance (e.g. `📍 800 m away`).

### Tasks
- [ ] Build `/api/feed/nearby` endpoint with PostGIS `ST_DWithin` & `ST_Distance`
- [ ] Add query parameter validation (enforce radius between 1 and 25 km, default 5 km)
- [ ] Add pagination (`page`, `limit`) and category multi-select filter
- [ ] Benchmark query speed with 10,000 mock records using GIST index

### Milestone
🎯 **User A posts an update from Location X. User B at Location Y (3 km away) sees it on a 5 km feed, while User C at Location Z (15 km away) does not.**

---

# 🖥️ PHASE 6 — Frontend UI & User Experience

## Goal
Build a responsive, modern, and engaging user interface with rich aesthetics, real-time feel, and smooth transitions.

### Design Principles & Visual Tokens
- **Color Palette**: Deep slate/charcoal dark mode, crisp high-contrast cards, semantic accent colors (Red for Alerts, Amber for Traffic, Blue for News, Emerald for Verified).
- **Typography**: Inter / Outfit for clean readability.
- **Component Feedback**: Micro-animations on upvoting/reporting, loading skeletons during geospatial queries.

### Pages & Components
#### Landing Page
- [ ] Hero section with animated local radius preview
- [ ] Value proposition ("Your neighborhood's real-time pulse")
- [ ] Direct call-to-action to enter local feed

#### Auth Pages (`/login`, `/register`)
- [ ] Clean card layout with real-time field validation
- [ ] Error alert banners for invalid credentials

#### Main Hyperlocal Feed (`/feed`)
- [ ] Location bar showing current detected locality & manual change trigger
- [ ] Interactive Radius Switcher toggle (`5 km` / `10 km`)
- [ ] Category pill filters (`All`, `🚨 Alerts`, `📰 News`, `🚧 Traffic`, `📅 Events`, `🐾 Lost & Found`)
- [ ] Post card component displaying relative distance (`📍 1.2 km away`), author badge, time ago, and quick actions
- [ ] Infinite scroll or pagination loader with empty state ("No updates in your 5 km radius yet — be the first to post!")

#### Create Post Modal / Page (`/create-post`)
- [ ] Category dropdown selector with visual badges
- [ ] Title & Description input with character counter
- [ ] Detected location confirmation banner
- [ ] Image upload preview (Release 1.5)
- [ ] Submit button with loading spinner

#### Post Details View (`/posts/:id`)
- [ ] Full post content with distance metric
- [ ] Community verification summary badge
- [ ] Report post button triggering modal

#### User Profile (`/profile`)
- [ ] User information, trust score badge, and post history list

---

# 🚩 PHASE 7 — Reporting & Community Safety System

## Goal
Empower the community to flag spam, misinformation, harassment, and inappropriate content.

### Report Categories
- `SPAM`
- `MISINFORMATION`
- `HARASSMENT`
- `HATE_SPEECH`
- `INAPPROPRIATE_CONTENT`
- `OUTDATED_INFO`
- `OTHER`

### Reports Database Schema
```sql
CREATE TYPE report_reason AS ENUM (
    'SPAM', 'MISINFORMATION', 'HARASSMENT', 
    'HATE_SPEECH', 'INAPPROPRIATE_CONTENT', 'OUTDATED_INFO', 'OTHER'
);

CREATE TYPE report_status AS ENUM ('PENDING', 'RESOLVED_REMOVED', 'RESOLVED_DISMISSED');

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason report_reason NOT NULL,
    description TEXT,
    status report_status DEFAULT 'PENDING',
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_post_report UNIQUE (post_id, reporter_id)
);

CREATE INDEX idx_reports_status ON reports(status);
```

### Reporting APIs
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/posts/:id/report` | Submit report for a post | Yes |

### Auto-Flagging Logic
- If a post receives **3 or more unique reports**, its status automatically changes from `ACTIVE` to `FLAGGED` and is temporarily hidden or marked with a warning label until reviewed by a moderator.

### Milestone
✅ Users can report posts once; multiple reports automatically trigger moderation flags.

---

# 🛡️ PHASE 8 — Moderator Dashboard & Administration

## Goal
Provide a dedicated portal for `MODERATOR` and `ADMIN` roles to review flagged content, resolve user reports, and maintain platform integrity.

### Moderator Actions
- **Approve**: Mark post as safe, reset status to `ACTIVE`, dismiss associated reports.
- **Remove**: Change post status to `REMOVED`, permanently hide from feeds.
- **Warn / Suspend**: Decrease creator's reputation score.

### Moderation APIs
| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/moderation/reports` | Get paginated list of pending reports | MODERATOR / ADMIN |
| `GET` | `/api/moderation/posts/flagged` | Get all flagged posts awaiting review | MODERATOR / ADMIN |
| `PATCH` | `/api/moderation/posts/:id/status` | Set status (`ACTIVE`, `REMOVED`, `FLAGGED`) | MODERATOR / ADMIN |
| `PATCH` | `/api/moderation/reports/:id` | Resolve report (`RESOLVED_REMOVED`, `DISMISSED`) | MODERATOR / ADMIN |

### Milestone
✅ Complete MVP cycle achieved: Users post $\rightarrow$ Community discovers $\rightarrow$ Community flags $\rightarrow$ Moderators act.

---

# ⚡ PHASE 9 — Real-Time Geofenced System (Release 2.0)

## Goal
Broadcast emergency alerts and new posts instantly to active users within the affected geographical area without requiring manual page refresh.

### Scalable Geohash Room Architecture
To avoid broadcasting every message to all connected users, the backend partitions WebSocket connections into **Geohash rooms**:
1. When a client connects, its coordinates are mapped to a **Geohash precision 5** string (~4.9 km × 4.9 km square).
2. The client joins its primary geohash room and its 8 adjacent neighbor rooms.
3. When an emergency post is created, the server computes the target geohash and emits exclusively to those specific rooms:

```javascript
// Server Socket.IO logic
const postGeohash = geohash.encode(lat, lng, 5);
const targetRooms = [postGeohash, ...geohash.neighbors(postGeohash)];

targetRooms.forEach(room => {
  io.to(`geo:${room}`).emit('new_nearby_post', formattedPost);
});
```

### Tasks
- [ ] Integrate Socket.IO server with authentication handshake
- [ ] Implement geohash room subscription on client location change
- [ ] Display live alert toast when a new `ALERT` is broadcasted in the active radius

---

# 🔔 PHASE 10 — Push Notifications (Release 2.0)

## Goal
Notify users about critical emergency alerts in their radius even when the browser tab is closed.

### Flow
```text
Emergency Post Created (Category: ALERT)
                ↓
Query Users with Saved Location within 5–10 km
                ↓
Format Notification Payload (Alert title + distance)
                ↓
Send via Firebase Cloud Messaging (FCM) / Web Push API
```

---

# 🗺️ PHASE 16 — Interactive Local Map (Release 2.0)

## Goal
Provide a full-screen or split-view map visualizer showing nearby community updates with color-coded markers.

### Features
- **Map Engine**: Leaflet with OpenStreetMap tiles (lightweight, open-source).
- **Radius Circle**: Visual circle overlay representing the user's active 5 km or 10 km zone.
- **Category Markers**:
  - 🔴 Emergency Alerts
  - 🟠 Traffic Incidents
  - 🔵 Local News
  - 🟢 Community Events

---

# 👥 PHASE 14 — Community Verification System (Release 2.5)

## Goal
Enable crowdsourced truth-checking for local news and alerts.

### Verification Database Schema
```sql
CREATE TYPE verification_vote AS ENUM ('CONFIRM', 'REJECT', 'NOT_SEEN');

CREATE TABLE post_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote verification_vote NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_post_verification UNIQUE (post_id, user_id)
);

CREATE INDEX idx_post_verifications_post ON post_verifications(post_id);
```

### Verification API
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/posts/:id/verify` | Submit confirmation vote (`CONFIRM`, `REJECT`, `NOT_SEEN`) | Yes |
| `GET` | `/api/posts/:id/verifications` | Get verification breakdown count | Optional |

---

# ⭐ PHASE 15 — User Reputation & Trust Scoring (Release 2.5)

## Goal
Reward accurate community reporting and deter bad actors through an algorithmic trust score (0 to 100).

### Trust Score Factors
- `+5 points`: Post receives 5+ community confirmations (`CONFIRM`)
- `+10 points`: Post verified and approved by moderator
- `-15 points`: Post flagged and removed by moderator
- `-5 points`: Post receives majority `REJECT` votes

---

# 🤖 PHASES 11–13 — AI Moderation & Misinformation Detection (Release 3.0)

## Goal
Incorporate AI pipelines for automated toxicity filtering, deepfake/media manipulation flags, and cross-source evidence verification.

### Processing Pipeline
```text
User Submits Post (Text + Image)
                ↓
    Text Toxicity & Spam Check (AI API)
                ↓
    Image Manipulation & Duplicate Reverse Search
                ↓
    Classification Result:
    - [LIKELY_SAFE] ➔ Published immediately
    - [SUSPICIOUS]  ➔ Published with "Community Verification Needed" label
    - [HIGH_RISK]   ➔ Sent to Moderator Queue before publishing
```

---

# 📊 PHASE 17 — Platform Analytics (Release 2.5)

Track platform engagement, safety metrics, and active geographic hotspots:
- Total active users per radius zone
- Posts per category distribution
- Resolution time for flagged content
- Verification accuracy rates

---

# 🧪 Comprehensive Testing Checklist

### 1. Geospatial & Feed Accuracy
- [ ] Post created at coordinate A is visible to coordinate B within 5 km.
- [ ] Post created at coordinate A is **not** visible to coordinate C at 12 km.
- [ ] Changing radius slider from 5 km to 10 km immediately expands feed results.
- [ ] GIST spatial index is utilized during queries (`EXPLAIN ANALYZE`).

### 2. Authentication & Authorization
- [ ] Unauthenticated requests to protected endpoints return `401 Unauthorized`.
- [ ] Standard users attempting to access `/api/moderation/*` return `403 Forbidden`.
- [ ] Tokens expire correctly and refresh without interrupting user experience.

### 3. Moderation & Safety
- [ ] 3 unique reports automatically change post status to `FLAGGED`.
- [ ] Removed posts disappear immediately from nearby feeds.
- [ ] Users cannot report or verify the same post multiple times.

### 4. Privacy & Edge Cases
- [ ] API responses do not expose raw author coordinates.
- [ ] Denying browser location gracefully opens manual location picker.
- [ ] Expired posts (past TTL) are excluded from active feeds.

---

# 🎯 Primary Success Criteria

> **A user can open the app, detect or select their local area, publish a categorized update, and another user within a 5–10 km radius can discover and verify that update in real time on their feed.**

---

# 📌 Current Project Status

## Active Phase
```text
PHASE 1 — PROJECT SETUP & ENVIRONMENT
```

## Immediate Next Steps
1. [ ] Create server directory structure with Express.js & healthcheck route
2. [ ] Create client directory with Vite + React
3. [ ] Set up PostgreSQL database with PostGIS spatial extension enabled
4. [ ] Configure environment variables and test API connectivity
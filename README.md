# Local_Lens
A hyperlocal news and community bulletin web application that delivers  verified local updates, events, and alerts within a 5–10 km radius using  geolocation and real-time systems.

To Start the PostgreSQL + PostGIS container
Make sure Docker Desktop is running, then from the project root (where docker-compose.yml lives), run: docker compose up -d
                                                                                                       docker ps



                                                                                                       ## Database setup (PostgreSQL + PostGIS)

1. Make sure Docker Desktop is running.
2. From the project root (where `docker-compose.yml` lives), run:

```bash
   docker compose up -d
```

3. Check that both containers are up:

```bash
   docker ps
```

- Database: `localhost:5432` (db `local_lens_db`)
- Adminer (web UI): http://localhost:8081

The tables are created automatically the first time the container starts. To reset the database completely (this deletes all data):

```bash
docker compose down -v
docker compose up -d
```
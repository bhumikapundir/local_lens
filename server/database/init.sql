-- Database blueprint: enables PostGIS spatial engine, defines custom enums,
-- creates tables (users, posts, reports, verifications), and builds GIST spatial index for radius queries.

-- 1. Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Define Enum Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('USER', 'MODERATOR', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE post_category AS ENUM (
        'ALERT', 'TRAFFIC', 'NEWS', 'EVENT', 
        'ANNOUNCEMENT', 'LOST_FOUND', 'COMMUNITY'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE post_status AS ENUM ('ACTIVE', 'PENDING_REVIEW', 'FLAGGED', 'REMOVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_reason AS ENUM (
        'SPAM', 'MISINFORMATION', 'HARASSMENT', 
        'HATE_SPEECH', 'INAPPROPRIATE_CONTENT', 'OUTDATED_INFO', 'OTHER'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('PENDING', 'RESOLVED_REMOVED', 'RESOLVED_DISMISSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_vote AS ENUM ('CONFIRM', 'REJECT', 'NOT_SEEN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Create Users Table
CREATE TABLE IF NOT EXISTS users (
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

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 4. Create Posts Table with PostGIS Geography Point
CREATE TABLE IF NOT EXISTS posts (
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

-- Crucial Spatial Index (GIST) for Fast Proximity Queries
CREATE INDEX IF NOT EXISTS idx_posts_location ON posts USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_posts_status_created ON posts(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- 5. Create Reports Table
CREATE TABLE IF NOT EXISTS reports (
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

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- 6. Create Post Verifications Table
CREATE TABLE IF NOT EXISTS post_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote verification_vote NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_post_verification UNIQUE (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_post_verifications_post ON post_verifications(post_id);

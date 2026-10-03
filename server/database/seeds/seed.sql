-- Seed data: sample users and Dehradun-area posts for development and frontend testing.
-- Safe to re-run: it removes old seed users (and their posts) first.
-- All seed users share the password: Password@123

DELETE FROM users WHERE email LIKE '%@seed.locallens.dev';

-- 1. Users (1 moderator, 4 regular users)
INSERT INTO users (id, name, email, password_hash, role, reputation_score, is_verified) VALUES
('00000000-0000-0000-0000-000000000001', 'Seed Moderator', 'mod@seed.locallens.dev',   '$2b$10$ICT8SmGZGmwNnaapLKWpX.Ko58Yp7V/gRl0HEY0qjBr3IDw.MFrgS', 'MODERATOR', 90, TRUE),
('00000000-0000-0000-0000-000000000002', 'Aarav Rawat',    'aarav@seed.locallens.dev', '$2b$10$ICT8SmGZGmwNnaapLKWpX.Ko58Yp7V/gRl0HEY0qjBr3IDw.MFrgS', 'USER', 75, TRUE),
('00000000-0000-0000-0000-000000000003', 'Meera Negi',     'meera@seed.locallens.dev', '$2b$10$ICT8SmGZGmwNnaapLKWpX.Ko58Yp7V/gRl0HEY0qjBr3IDw.MFrgS', 'USER', 60, FALSE),
('00000000-0000-0000-0000-000000000004', 'Kabir Bisht',    'kabir@seed.locallens.dev', '$2b$10$ICT8SmGZGmwNnaapLKWpX.Ko58Yp7V/gRl0HEY0qjBr3IDw.MFrgS', 'USER', 50, FALSE),
('00000000-0000-0000-0000-000000000005', 'Riya Thapa',     'riya@seed.locallens.dev',  '$2b$10$ICT8SmGZGmwNnaapLKWpX.Ko58Yp7V/gRl0HEY0qjBr3IDw.MFrgS', 'USER', 35, FALSE);

-- 2. Posts around Dehradun (coordinates are approximate)
INSERT INTO posts (user_id, title, content, category, location, locality_name, status, reports_count, created_at, expires_at) VALUES
('00000000-0000-0000-0000-000000000002', 'Traffic jam near Clock Tower', 'Heavy traffic around Ghanta Ghar due to a broken-down bus. Avoid Rajpur Road side for the next hour.', 'TRAFFIC',
  ST_SetSRID(ST_MakePoint(78.0414, 30.3243), 4326)::geography, 'Clock Tower, Dehradun', 'ACTIVE', 0, NOW() - INTERVAL '20 minutes', NOW() + INTERVAL '11 hours'),

('00000000-0000-0000-0000-000000000003', 'Water supply cut in Dalanwala', 'Water supply will be off from 10 AM to 4 PM tomorrow for pipeline repair work.', 'ANNOUNCEMENT',
  ST_SetSRID(ST_MakePoint(78.0480, 30.3270), 4326)::geography, 'Dalanwala, Dehradun', 'ACTIVE', 0, NOW() - INTERVAL '2 hours', NOW() + INTERVAL '13 days'),

('00000000-0000-0000-0000-000000000004', 'Lost dog near Race Course', 'Brown Labrador named Bruno missing since morning. Wearing a red collar. Please call if seen.', 'LOST_FOUND',
  ST_SetSRID(ST_MakePoint(78.0330, 30.3170), 4326)::geography, 'Race Course, Dehradun', 'ACTIVE', 0, NOW() - INTERVAL '5 hours', NOW() + INTERVAL '29 days'),

('00000000-0000-0000-0000-000000000002', 'Weekend book fair at Parade Ground', 'Local publishers and students are hosting a two-day book fair this Saturday and Sunday. Entry is free.', 'EVENT',
  ST_SetSRID(ST_MakePoint(78.0400, 30.3235), 4326)::geography, 'Parade Ground, Dehradun', 'ACTIVE', 0, NOW() - INTERVAL '1 day', NOW() + INTERVAL '2 days'),

('00000000-0000-0000-0000-000000000005', 'Road blocked on Rajpur Road', 'A fallen tree is blocking one lane near the Rajpur Road crossing. Municipal team is on the way.', 'ALERT',
  ST_SetSRID(ST_MakePoint(78.0670, 30.3360), 4326)::geography, 'Rajpur Road, Dehradun', 'ACTIVE', 0, NOW() - INTERVAL '40 minutes', NOW() + INTERVAL '23 hours'),

('00000000-0000-0000-0000-000000000003', 'New cafe opening in Paltan Bazaar', 'A new community cafe opens this Friday near Paltan Bazaar with live music in the evening.', 'NEWS',
  ST_SetSRID(ST_MakePoint(78.0393, 30.3218), 4326)::geography, 'Paltan Bazaar, Dehradun', 'ACTIVE', 0, NOW() - INTERVAL '3 hours', NOW() + INTERVAL '6 days'),

('00000000-0000-0000-0000-000000000004', 'Bus delays at ISBT', 'Several buses to Haridwar and Rishikesh are running late because of a road diversion.', 'TRAFFIC',
  ST_SetSRID(ST_MakePoint(78.0089, 30.2896), 4326)::geography, 'ISBT, Dehradun', 'ACTIVE', 0, NOW() - INTERVAL '1 hour', NOW() + INTERVAL '10 hours'),

('00000000-0000-0000-0000-000000000002', 'Morning walk group at FRI', 'Neighbourhood walking group meets daily at 6 AM near the FRI main gate. Everyone is welcome.', 'COMMUNITY',
  ST_SetSRID(ST_MakePoint(77.9984, 30.3402), 4326)::geography, 'Forest Research Institute, Dehradun', 'ACTIVE', 0, NOW() - INTERVAL '2 days', NOW() + INTERVAL '12 days'),

('00000000-0000-0000-0000-000000000003', 'Power cut in Ballupur', 'Electricity department has announced a power cut from 2 PM to 5 PM for maintenance.', 'ANNOUNCEMENT',
  ST_SetSRID(ST_MakePoint(78.0120, 30.3340), 4326)::geography, 'Ballupur Chowk, Dehradun', 'ACTIVE', 0, NOW() - INTERVAL '4 hours', NOW() + INTERVAL '13 days'),

('00000000-0000-0000-0000-000000000005', 'Lost wallet near Prem Nagar', 'Found a black wallet with some cards near the Prem Nagar market. Contact me to claim it.', 'LOST_FOUND',
  ST_SetSRID(ST_MakePoint(77.9700, 30.3300), 4326)::geography, 'Prem Nagar, Dehradun', 'ACTIVE', 0, NOW() - INTERVAL '6 hours', NOW() + INTERVAL '29 days'),

('00000000-0000-0000-0000-000000000004', 'Street clean-up drive in Clement Town', 'Volunteers are meeting on Sunday at 8 AM for a clean-up drive. Gloves and bags will be provided.', 'EVENT',
  ST_SetSRID(ST_MakePoint(78.0010, 30.2630), 4326)::geography, 'Clement Town, Dehradun', 'ACTIVE', 0, NOW() - INTERVAL '8 hours', NOW() + INTERVAL '3 days'),

('00000000-0000-0000-0000-000000000002', 'Rain waterlogging near Jakhan', 'Water has collected on the road near Jakhan after the evening rain. Drive carefully.', 'ALERT',
  ST_SetSRID(ST_MakePoint(78.0690, 30.3560), 4326)::geography, 'Jakhan, Dehradun', 'ACTIVE', 0, NOW() - INTERVAL '30 minutes', NOW() + INTERVAL '23 hours'),

('00000000-0000-0000-0000-000000000003', 'Sahastradhara Road repair work', 'Road repair is going on near Sahastradhara Road. Expect slow traffic for the next two days.', 'NEWS',
  ST_SetSRID(ST_MakePoint(78.1260, 30.3880), 4326)::geography, 'Sahastradhara Road, Dehradun', 'ACTIVE', 0, NOW() - INTERVAL '1 day', NOW() + INTERVAL '6 days'),

-- Edge case: EXPIRED post (should never appear in the feed)
('00000000-0000-0000-0000-000000000004', 'Expired: traffic diversion yesterday', 'This traffic diversion ended yesterday. This post should not show in any feed.', 'TRAFFIC',
  ST_SetSRID(ST_MakePoint(78.0420, 30.3250), 4326)::geography, 'Clock Tower, Dehradun', 'ACTIVE', 0, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),

-- Edge case: FLAGGED post (hidden from feed, visible to moderator)
('00000000-0000-0000-0000-000000000005', 'Flagged: suspicious forwarded message', 'Unverified forwarded message about a fake lottery. This post has 3 reports and is waiting for moderator review.', 'NEWS',
  ST_SetSRID(ST_MakePoint(78.0405, 30.3230), 4326)::geography, 'Clock Tower, Dehradun', 'FLAGGED', 3, NOW() - INTERVAL '3 hours', NOW() + INTERVAL '6 days');
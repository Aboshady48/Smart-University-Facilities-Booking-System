CREATE DATABASE smart_university;
USE smart_university;

CREATE TABLE student (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name  VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'student', -- student | admin | staff
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES student(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,          -- room | lab | hall | equipment
    capacity INT CHECK (capacity > 0),
    rules JSONB,                        -- booking rules (time limits, restrictions)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
--{
 -- "max_hours_per_booking": 2,
  --"available_from": "08:00",
  --"available_to": "20:00",
  --"allowed_roles": ["student", "staff"]
--}
--



--User books a resource
--Time-based
--Status lifecycle
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
    resource_id INT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,

    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,

    status VARCHAR(20) DEFAULT 'pending',  
    -- pending | approved | rejected | cancelled | completed

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (end_time > start_time)
);

ALTER TABLE bookings DROP CONSTRAINT no_overlapping_bookings;

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE bookings
ADD CONSTRAINT no_overlapping_bookings
EXCLUDE USING gist (
    resource_id WITH =,
    tsrange(start_time, end_time) WITH &&
)
WHERE (status = 'approved');

CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Example policy entry:
-- {
--   "key": "booking_rules",
--   "value": {
--     "max_hours_per_booking": 2
-- }


CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    actor_id INT REFERENCES student(id),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(50),
    entity_id INT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--exmple log entry:
--{
--  "old_status": "pending",
--  "new_status": "approved"
--}

CREATE INDEX idx_student_email ON student(email);
CREATE INDEX idx_bookings_student ON bookings(student_id);
CREATE INDEX idx_bookings_resource ON bookings(resource_id);
CREATE INDEX idx_bookings_time ON bookings(start_time, end_time);



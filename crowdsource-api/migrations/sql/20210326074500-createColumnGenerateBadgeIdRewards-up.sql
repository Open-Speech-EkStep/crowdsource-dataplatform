/* Replace with your SQL commands */
create extension if not exists "pgcrypto";
ALTER TABLE rewards
    ADD COLUMN generated_badge_id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid();
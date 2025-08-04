-- Create the user_type enum that's referenced in the handle_new_user function
CREATE TYPE user_type AS ENUM ('ai_builder', 'ai_investor');
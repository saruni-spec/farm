
-- Public Profile table 
CREATE TABLE public.profile (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY, -- Links to the auth.users table
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin table (each admin is a user profile)
CREATE TABLE public.admin (
  profile_id uuid REFERENCES public.profile ON DELETE CASCADE PRIMARY KEY -- Link to profile table and make it the PK
);

-- Farmer table (each farmer is a user profile)
CREATE TABLE public.farmer (
  profile_id uuid REFERENCES public.profile ON DELETE CASCADE PRIMARY KEY -- Link to profile table and make it the PK
);

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer ENABLE ROW LEVEL SECURITY;

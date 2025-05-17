
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

-- Farm table (linked to a farmer, includes geometry)
CREATE TABLE public.farm (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid REFERENCES public.farmer ON DELETE CASCADE NOT NULL,
  name TEXT,
  geom GEOMETRY(POLYGON, 4326),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to update the updated_at timestamp on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the update_updated_at_column function before update
CREATE TRIGGER update_farm_updated_at
BEFORE UPDATE ON public.farm
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Spatial index for farm geometries
CREATE INDEX idx_farm_geom ON public.farm USING GIST (geom);

-- Enable Row Level Security (RLS) on the farm table!
ALTER TABLE public.farm ENABLE ROW LEVEL SECURITY;




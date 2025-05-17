
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





-- Policy to allow authenticated users (farmers) to insert farms
-- They can only insert rows where the farmer_id is their own user ID (auth.uid())
CREATE POLICY "Allow authenticated users to create their own farms" ON "public"."farm"
AS PERMISSIVE FOR INSERT
TO authenticated -- Apply this policy to authenticated users
WITH CHECK (farmer_id = auth.uid()); -- Check that the inserted row's farmer_id matches the authenticated user's ID

-- Policy to allow authenticated users (farmers) to view their own farms
CREATE POLICY "Allow authenticated users to view their own farms" ON "public"."farm"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (farmer_id = auth.uid()); -- Users can only SELECT rows where the farmer_id matches their own user ID

-- Policy to allow authenticated users (farmers) to update their own farms
CREATE POLICY "Allow authenticated users to update their own farms" ON "public"."farm"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (farmer_id = auth.uid()) -- Users can only UPDATE rows where the farmer_id matches their own user ID
WITH CHECK (farmer_id = auth.uid()); -- Additionally, prevent them from changing the farmer_id to something else during update

-- Policy to allow authenticated users (farmers) to delete their own farms
CREATE POLICY "Allow authenticated users to delete their own farms" ON "public"."farm"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (farmer_id = auth.uid()); -- Users can only DELETE rows where the farmer_id matches their own user ID




-- 1. Create the function that runs after a new user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a profile entry in the public.profile table
  -- The new user's ID is available as NEW.id
  -- Metadata from signup options is available as NEW.raw_user_meta_data
  INSERT INTO public.profile (id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name', -- Extract first_name from JSON metadata
    NEW.raw_user_meta_data->>'last_name'   -- Extract last_name from JSON metadata
    -- If you stored phone in profile, you could add it here too:
    -- NEW.raw_user_meta_data->>'phone'
  );

  -- Create a farmer entry in the public.farmer table
  -- Linking it to the profile (which shares the same ID as the auth.users ID)
  INSERT INTO public.farmer (profile_id)
  VALUES (NEW.id);

  RETURN NEW; -- Return the new row from auth.users
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- SECURITY DEFINER is important so this function has permissions to write to public.profile and public.farmer

-- 2. Create the trigger on the auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users -- Fire AFTER an INSERT on the auth.users table
  FOR EACH ROW -- For each row that is inserted
  EXECUTE FUNCTION public.handle_new_user(); -- Execute the function we created
-- Users table (assumed base user table)

CREATE TABLE profile (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- Admin table (each admin is a user)
CREATE TABLE admin (

  profile_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  CONSTRAINT fk_admin_user FOREIGN KEY (profile_id) REFERENCES profile(id)

);


-- Farmer table (each farmer is a user)
CREATE TABLE farmer (
 
  profile_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  CONSTRAINT fk_farmer_user FOREIGN KEY (profile_id) REFERENCES profile(id)
);




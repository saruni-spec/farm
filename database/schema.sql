-- Users table (assumed base user table)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin table (each admin is a user)
CREATE TABLE admin (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Farmer table (each farmer is a user)
CREATE TABLE farmer (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  CONSTRAINT fk_farmer_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Farms table (linked to a farmer, includes geometry)
CREATE TABLE farms (
  id SERIAL PRIMARY KEY,
  farmer_id INTEGER NOT NULL,
  name TEXT,
  geom GEOMETRY(POLYGON, 4326),
  CONSTRAINT fk_farm_farmer FOREIGN KEY (farmer_id) REFERENCES farmer(id)
);

-- Spatial index for farm geometries
CREATE INDEX idx_farms_geom ON farms USING GIST (geom);

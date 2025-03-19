-- Stalls Table
CREATE TABLE IF NOT EXISTS stalls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stall_event_id UUID REFERENCES stall_events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  size VARCHAR(255) NOT NULL,
  location_in_venue VARCHAR(255),
  is_available BOOLEAN DEFAULT TRUE,
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE
);
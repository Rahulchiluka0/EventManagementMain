-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  stall_id UUID REFERENCES stalls(id) ON DELETE SET NULL,
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status booking_status DEFAULT 'pending',
  quantity INTEGER DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_event_or_stall CHECK (
    (event_id IS NOT NULL AND stall_id IS NULL) OR
    (event_id IS NULL AND stall_id IS NOT NULL)
  )
);
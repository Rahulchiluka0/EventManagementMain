
-- Stall Requests Table
CREATE TABLE IF NOT EXISTS stall_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES users(id),
  stall_event_id UUID NOT NULL REFERENCES stall_events(id),
  stall_id UUID REFERENCES stalls(id),
  organizer_id UUID REFERENCES users(id),
  request_message TEXT,
  status verification_status DEFAULT 'pending',
  response_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
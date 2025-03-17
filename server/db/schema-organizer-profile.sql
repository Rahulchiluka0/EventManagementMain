CREATE TABLE IF NOT EXISTS organizer_profiles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_name VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  description TEXT,
  tax_id VARCHAR(100),
  event_types JSONB,
  pan_card_path VARCHAR(255),
  canceled_check_path VARCHAR(255),
  agreement_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

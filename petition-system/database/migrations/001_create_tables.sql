CREATE TABLE IF NOT EXISTS petitions (
    id SERIAL PRIMARY KEY,
    petition_id VARCHAR(20) UNIQUE NOT NULL,
    from_name VARCHAR(100) NOT NULL,
    to_department VARCHAR(100) NOT NULL,
    whatsapp_number VARCHAR(15) NOT NULL,
    petition_text TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS responses (
    id SERIAL PRIMARY KEY,
    petition_id INTEGER REFERENCES petitions(id) ON DELETE CASCADE,
    response_text TEXT NOT NULL,
    response_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_final BOOLEAN DEFAULT FALSE,
    responded_by VARCHAR(20) DEFAULT 'official' CHECK (responded_by IN ('official','admin'))
);

CREATE INDEX IF NOT EXISTS idx_petitions_petition_id ON petitions(petition_id);
CREATE INDEX IF NOT EXISTS idx_petitions_status ON petitions(status);
CREATE INDEX IF NOT EXISTS idx_petitions_department ON petitions(to_department);

-- simple trigger to keep updated_at current
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at'
    ) THEN
        CREATE OR REPLACE FUNCTION set_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'petitions_updated_at'
    ) THEN
        CREATE TRIGGER petitions_updated_at
        BEFORE UPDATE ON petitions
        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    END IF;
END $$;
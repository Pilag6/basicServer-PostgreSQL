-- CREATE DATABASE
CREATE DATABASE <name>;

-- CREATE TABLE
CREATE TABLE IF NOT EXISTS <table> ( 
    id SERIAL PRIMARY KEY,
    <example1> VARCHAR(255) NOT NULL UNIQUE,
    <example2> TEXT,
    <example3> BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INSERT
INSERT INTO <table> (<example1>, <example2>) 
    VALUES 
        ('<example1>', '<example2>', '<example3>'),
        ('<example1>', '<example2>', '<example3>'),
        ('<example1>', '<example2>', '<example3>')
    ON CONFLICT (<example1>) 
    DO UPDATE SET 
        description = EXCLUDED.description,
        updated_at = CURRENT_TIMESTAMP

-- SELECT
SELECT * FROM <table>;
-- Migration: Add is_demo column to posts table
-- Run this if you already have the posts table created

ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;


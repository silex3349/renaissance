
-- This file contains the SQL functions used for the wallet application
-- You should run these SQL commands in your Supabase SQL Editor

-- Function to get a user's profile
CREATE OR REPLACE FUNCTION public.get_user_profile(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  coins INTEGER,
  user_category TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.username, p.full_name, p.avatar_url, p.coins, p.user_category
  FROM public.profiles p
  WHERE p.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get a user's transactions
CREATE OR REPLACE FUNCTION public.get_user_transactions(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  transaction_type TEXT,
  amount INTEGER,
  description TEXT,
  timestamp TIMESTAMPTZ,
  details JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT t.id, t.transaction_type, t.amount, t.description, t.timestamp, t.details
  FROM public.coin_transactions t
  WHERE t.user_id = user_uuid
  ORDER BY t.timestamp DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- This file contains updated SQL functions for wallet application v2
-- These can be run after wallet-app.sql to enhance functionality

-- Create the increment function needed for updating stats
CREATE OR REPLACE FUNCTION public.increment(value INTEGER)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT $1 + 1
$$;

-- Add trigger to update user_category automatically when activity changes
CREATE OR REPLACE FUNCTION public.update_user_category_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Call the recalculate function for the affected user
  PERFORM public.recalculate_user_category(NEW.user_id);
  RETURN NEW;
END;
$$;

-- Create trigger on user_stats table
DROP TRIGGER IF EXISTS user_stats_update_category ON public.user_stats;
CREATE TRIGGER user_stats_update_category
  AFTER INSERT OR UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_category_trigger();

-- Function to check if an event should be free (first 2 per group per month)
CREATE OR REPLACE FUNCTION public.is_free_group_event(
  creator_id UUID,
  group_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  event_count INTEGER;
BEGIN
  -- Count events created by this user in this group in the current month
  SELECT COUNT(*) INTO event_count
  FROM public.coin_transactions
  WHERE user_id = creator_id
    AND transaction_type = 'event_creation_fee'
    AND details->>'groupId' = group_id
    AND timestamp >= date_trunc('month', current_date);
  
  -- First 2 events per group per month are free
  RETURN event_count < 2;
END;
$$;

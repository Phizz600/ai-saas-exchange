-- Create the missing trigger that calls handle_new_user when a new user signs up
-- This is what was causing the signup to fail - the function existed but wasn't being triggered

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
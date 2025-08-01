-- Phase 3: Enhanced Security Monitoring

-- Create comprehensive audit logging function
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_admin_id uuid,
  p_action text,
  p_details jsonb DEFAULT '{}',
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.admin_audit_log (
    admin_user_id,
    action,
    details,
    ip_address,
    user_agent,
    created_at
  ) VALUES (
    p_admin_id,
    p_action,
    p_details,
    p_ip_address,
    p_user_agent,
    now()
  );
END;
$$;

-- Create session cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.admin_sessions 
  WHERE expires_at < now();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log cleanup action
  INSERT INTO public.admin_audit_log (
    action,
    details,
    created_at
  ) VALUES (
    'session_cleanup',
    jsonb_build_object('deleted_sessions', deleted_count),
    now()
  );
  
  RETURN deleted_count;
END;
$$;
-- Fix Function Search Path security issue
CREATE OR REPLACE FUNCTION public.authenticate_admin(user_email text, user_password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    admin_record RECORD;
    result jsonb;
BEGIN
    -- Get admin user record
    SELECT id, email, password_hash, is_active, totp_verified
    INTO admin_record
    FROM admin_users
    WHERE email = user_email AND is_active = true;
    
    -- Check if admin exists and password matches
    IF admin_record.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid credentials');
    END IF;
    
    -- For now, simple password comparison (will be enhanced with proper hashing)
    IF admin_record.password_hash != user_password THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid credentials');
    END IF;
    
    -- Return success with admin info
    RETURN jsonb_build_object(
        'success', true,
        'admin_id', admin_record.id,
        'email', admin_record.email,
        'totp_verified', admin_record.totp_verified
    );
END;
$$;
-- Fix all functions to use empty search_path for security
CREATE OR REPLACE FUNCTION public.authenticate_admin(user_email text, user_password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    admin_record RECORD;
    result jsonb;
BEGIN
    -- Get admin user record (now fully qualified)
    SELECT id, email, password_hash, is_active, totp_verified
    INTO admin_record
    FROM public.admin_users
    WHERE email = user_email AND is_active = true;
    
    -- Check if admin exists and password matches
    IF admin_record.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid credentials');
    END IF;
    
    -- Simple password comparison (will be enhanced with proper hashing)
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

-- Fix is_authenticated_admin function
CREATE OR REPLACE FUNCTION public.is_authenticated_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
DECLARE
    session_admin_id uuid;
BEGIN
    -- Check if there's a valid admin session
    session_admin_id := current_setting('app.current_admin_id', true)::uuid;
    
    IF session_admin_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Verify admin exists and is active (now fully qualified)
    RETURN EXISTS(
        SELECT 1 FROM public.admin_users 
        WHERE id = session_admin_id 
        AND is_active = true 
        AND totp_verified = true
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$;

-- Fix other existing functions as well
CREATE OR REPLACE FUNCTION public.verify_admin_password_by_id(admin_user_id uuid, provided_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    stored_hash TEXT;
BEGIN
    SELECT password_hash INTO stored_hash
    FROM public.admin_users
    WHERE id = admin_user_id AND is_active = true;

    IF stored_hash IS NULL THEN
        RETURN false;
    END IF;

    -- For development: simple text comparison
    RETURN stored_hash = provided_password;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_admin_password(admin_user_id uuid, new_password text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.admin_users
    SET password_hash = new_password,
        updated_at = now()
    WHERE id = admin_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;
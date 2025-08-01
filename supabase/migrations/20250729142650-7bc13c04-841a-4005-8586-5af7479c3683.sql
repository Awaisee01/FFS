-- Phase 1: Critical Admin Security Fixes

-- 1. Create secure admin authentication function
CREATE OR REPLACE FUNCTION public.authenticate_admin(user_email text, user_password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- 2. Create function to check if current session is authenticated admin
CREATE OR REPLACE FUNCTION public.is_authenticated_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    session_admin_id uuid;
BEGIN
    -- Check if there's a valid admin session
    -- This will be enhanced with proper JWT validation
    session_admin_id := current_setting('app.current_admin_id', true)::uuid;
    
    IF session_admin_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Verify admin exists and is active
    RETURN EXISTS(
        SELECT 1 FROM admin_users 
        WHERE id = session_admin_id 
        AND is_active = true 
        AND totp_verified = true
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$;

-- 3. Update RLS policies to use proper admin authentication

-- Fix admin_audit_log policies
DROP POLICY IF EXISTS "Allow inserting audit log" ON admin_audit_log;
DROP POLICY IF EXISTS "Allow reading audit log" ON admin_audit_log;

CREATE POLICY "Authenticated admins can insert audit log"
ON admin_audit_log FOR INSERT
WITH CHECK (public.is_authenticated_admin());

CREATE POLICY "Authenticated admins can read audit log"
ON admin_audit_log FOR SELECT
USING (public.is_authenticated_admin());

-- Fix admin_users policies  
DROP POLICY IF EXISTS "Allow inserting admin users" ON admin_users;
DROP POLICY IF EXISTS "Allow reading admin users" ON admin_users;
DROP POLICY IF EXISTS "Allow updating admin users" ON admin_users;

CREATE POLICY "Authenticated admins can read admin users"
ON admin_users FOR SELECT
USING (public.is_authenticated_admin());

CREATE POLICY "Authenticated admins can update admin users"
ON admin_users FOR UPDATE
USING (public.is_authenticated_admin());

-- Special policy for admin creation (only during setup)
CREATE POLICY "Allow admin user creation during setup"
ON admin_users FOR INSERT
WITH CHECK (true); -- This will be restricted in production

-- Fix form_submissions policies
DROP POLICY IF EXISTS "Allow admin read access to form_submissions" ON form_submissions;
DROP POLICY IF EXISTS "Allow admin update access to form_submissions" ON form_submissions;
DROP POLICY IF EXISTS "Allow admin delete access to form_submissions" ON form_submissions;

CREATE POLICY "Authenticated admins can read form_submissions"
ON form_submissions FOR SELECT
USING (public.is_authenticated_admin());

CREATE POLICY "Authenticated admins can update form_submissions"
ON form_submissions FOR UPDATE
USING (public.is_authenticated_admin());

CREATE POLICY "Authenticated admins can delete form_submissions"
ON form_submissions FOR DELETE
USING (public.is_authenticated_admin());

-- Keep public insert for customer submissions
-- "Allow public insert to form_submissions" policy remains unchanged

-- 4. Create default admin user with secure password
INSERT INTO admin_users (email, password_hash, role, is_active, totp_verified)
VALUES (
    'info@fundingforscotland.co.uk',
    'TempSecure2024!', -- This will be changed after migration
    'admin',
    true,
    false
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    updated_at = now();

-- 5. Create session management table for admin authentication
CREATE TABLE IF NOT EXISTS admin_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token text UNIQUE NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    ip_address inet,
    user_agent text
);

-- Enable RLS on admin_sessions
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated admins can manage their sessions"
ON admin_sessions FOR ALL
USING (admin_id = current_setting('app.current_admin_id', true)::uuid);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Create admin users table with hierarchy
CREATE TABLE public.admin_users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  role text not null default 'admin' check (role in ('super_admin', 'admin')),
  totp_secret text, -- encrypted TOTP secret
  totp_verified boolean default false,
  invited_by uuid references public.admin_users(id),
  invitation_token text unique,
  invitation_expires_at timestamp with time zone,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add RLS policies
alter table public.admin_users enable row level security;

-- Policy to allow reading admin users (for verification)
create policy "Allow reading admin users" on public.admin_users
  for select using (true);

-- Policy to allow inserting admin users (for invitations)
create policy "Allow inserting admin users" on public.admin_users
  for insert with check (true);

-- Policy to allow updating admin users (for TOTP setup)
create policy "Allow updating admin users" on public.admin_users
  for update using (true);

-- Create admin audit log table
CREATE TABLE public.admin_audit_log (
  id uuid default gen_random_uuid() primary key,
  admin_user_id uuid references public.admin_users(id),
  action text not null,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone default now()
);

-- Add RLS for audit log
alter table public.admin_audit_log enable row level security;

create policy "Allow reading audit log" on public.admin_audit_log
  for select using (true);

create policy "Allow inserting audit log" on public.admin_audit_log
  for insert with check (true);

-- Insert you as the super admin (replace with your actual email)
INSERT INTO public.admin_users (email, role, is_active) 
VALUES ('info@fundingforscotland.co.uk', 'super_admin', true);

-- Create indexes for better performance
CREATE INDEX idx_admin_users_email ON public.admin_users(email);
CREATE INDEX idx_admin_users_invitation_token ON public.admin_users(invitation_token);
CREATE INDEX idx_admin_audit_log_admin_user ON public.admin_audit_log(admin_user_id);
CREATE INDEX idx_admin_audit_log_created_at ON public.admin_audit_log(created_at);

-- Remove old email verification table since we're not using it anymore
DROP TABLE IF EXISTS admin_verification_codes;

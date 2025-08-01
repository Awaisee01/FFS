
-- Create table for admin verification codes
create table if not exists admin_verification_codes (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  code text not null,
  expires_at timestamp with time zone not null,
  used boolean default false,
  created_at timestamp with time zone default now()
);

-- Add RLS policies
alter table admin_verification_codes enable row level security;

-- Policy to allow inserting verification codes
create policy "Allow inserting verification codes" on admin_verification_codes
  for insert with check (true);

-- Policy to allow reading verification codes for verification
create policy "Allow reading verification codes" on admin_verification_codes
  for select using (true);

-- Policy to allow updating verification codes (marking as used)
create policy "Allow updating verification codes" on admin_verification_codes
  for update using (true);

-- Create index for faster lookups
create index if not exists idx_admin_verification_codes_email_code on admin_verification_codes(email, code);
create index if not exists idx_admin_verification_codes_expires_at on admin_verification_codes(expires_at);

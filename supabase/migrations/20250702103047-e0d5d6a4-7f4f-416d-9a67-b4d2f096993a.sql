
-- Create enum for lead status tracking
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'closed');

-- Create enum for service types
CREATE TYPE public.service_type AS ENUM ('eco4', 'solar', 'gas_boilers', 'home_improvements');

-- Create form submissions table
CREATE TABLE public.form_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type service_type NOT NULL,
  status lead_status DEFAULT 'new' NOT NULL,
  
  -- Contact Information
  name text NOT NULL,
  email text,
  phone text,
  postcode text,
  
  -- Property Information
  property_type text,
  property_ownership text,
  current_heating_system text,
  
  -- Additional form data (flexible JSON storage)
  form_data jsonb,
  
  -- Marketing Attribution
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  
  -- Meta Information
  page_path text NOT NULL,
  user_agent text,
  ip_address inet,
  
  -- Admin Notes
  admin_notes text,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  contacted_at timestamp with time zone,
  converted_at timestamp with time zone
);

-- Create indexes for better performance
CREATE INDEX idx_form_submissions_service_type ON public.form_submissions(service_type);
CREATE INDEX idx_form_submissions_status ON public.form_submissions(status);
CREATE INDEX idx_form_submissions_created_at ON public.form_submissions(created_at DESC);
CREATE INDEX idx_form_submissions_email ON public.form_submissions(email);

-- Enable RLS (Row Level Security)
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (forms can submit)
CREATE POLICY "Allow public insert to form_submissions" 
  ON public.form_submissions 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for admin read access
CREATE POLICY "Allow admin read access to form_submissions" 
  ON public.form_submissions 
  FOR SELECT 
  USING (true);

-- Create policy for admin update access  
CREATE POLICY "Allow admin update access to form_submissions" 
  ON public.form_submissions 
  FOR UPDATE 
  USING (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_form_submissions_updated_at 
  BEFORE UPDATE ON public.form_submissions 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create stats view for admin dashboard
CREATE VIEW public.form_submission_stats AS
SELECT 
  service_type,
  status,
  COUNT(*) as count,
  DATE_TRUNC('day', created_at) as submission_date
FROM public.form_submissions
GROUP BY service_type, status, DATE_TRUNC('day', created_at)
ORDER BY submission_date DESC;

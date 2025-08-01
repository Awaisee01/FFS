
-- Update the lead_status enum to include the new status values
ALTER TYPE public.lead_status RENAME TO lead_status_old;

CREATE TYPE public.lead_status AS ENUM (
  'new',
  'survey_booked', 
  'lost',
  'doesnt_qualify',
  'no_contact'
);

-- Update the form_submissions table to use the new enum
ALTER TABLE public.form_submissions 
  ALTER COLUMN status DROP DEFAULT;

ALTER TABLE public.form_submissions 
  ALTER COLUMN status TYPE public.lead_status 
  USING (
    CASE status::text
      WHEN 'new' THEN 'new'::public.lead_status
      WHEN 'contacted' THEN 'survey_booked'::public.lead_status
      WHEN 'qualified' THEN 'survey_booked'::public.lead_status
      WHEN 'converted' THEN 'survey_booked'::public.lead_status
      WHEN 'closed' THEN 'no_contact'::public.lead_status
      WHEN 'lost' THEN 'lost'::public.lead_status
      ELSE 'new'::public.lead_status
    END
  );

ALTER TABLE public.form_submissions 
  ALTER COLUMN status SET DEFAULT 'new'::public.lead_status;

-- Drop the old enum
DROP TYPE public.lead_status_old;

-- Recreate the form_submission_stats view with updated enum
DROP VIEW IF EXISTS public.form_submission_stats;

CREATE VIEW public.form_submission_stats AS
SELECT 
  service_type,
  status,
  COUNT(*) as count,
  DATE_TRUNC('day', created_at) as submission_date
FROM public.form_submissions
GROUP BY service_type, status, DATE_TRUNC('day', created_at)
ORDER BY submission_date DESC;

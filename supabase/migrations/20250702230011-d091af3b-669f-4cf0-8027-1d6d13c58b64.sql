
-- Add EPC Score field to form_submissions table
ALTER TABLE public.form_submissions 
ADD COLUMN epc_score text;

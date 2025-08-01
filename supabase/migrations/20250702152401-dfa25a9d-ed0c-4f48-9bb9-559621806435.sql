
-- Add DELETE policy for form_submissions table to allow admin delete access
CREATE POLICY "Allow admin delete access to form_submissions" 
  ON public.form_submissions 
  FOR DELETE 
  USING (true);

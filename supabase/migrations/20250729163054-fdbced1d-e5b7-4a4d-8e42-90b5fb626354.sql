-- Create a function to trigger email notifications for new form submissions
CREATE OR REPLACE FUNCTION public.trigger_form_notification()
RETURNS TRIGGER AS $$
DECLARE
  notification_result JSONB;
BEGIN
  -- Call the send-enquiry-notification function
  SELECT net.http_post(
    url := 'https://nncpapnlnrtssbruzkla.supabase.co/functions/v1/send-enquiry-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'submissionId', NEW.id
    )
  ) INTO notification_result;
  
  -- Log the notification attempt
  INSERT INTO public.admin_audit_log (action, details)
  VALUES (
    'email_notification_triggered',
    jsonb_build_object(
      'submission_id', NEW.id,
      'service_type', NEW.service_type,
      'name', NEW.name,
      'notification_result', notification_result
    )
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors but don't fail the form submission
    INSERT INTO public.admin_audit_log (action, details)
    VALUES (
      'email_notification_error',
      jsonb_build_object(
        'submission_id', NEW.id,
        'error', SQLERRM
      )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS form_submission_notification_trigger ON public.form_submissions;
CREATE TRIGGER form_submission_notification_trigger
  AFTER INSERT ON public.form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_form_notification();
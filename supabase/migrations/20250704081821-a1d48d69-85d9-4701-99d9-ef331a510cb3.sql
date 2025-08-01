
-- Update the lead_status enum to include the new status values
ALTER TYPE lead_status ADD VALUE 'survey_booked';
ALTER TYPE lead_status ADD VALUE 'doesnt_qualify'; 
ALTER TYPE lead_status ADD VALUE 'no_contact';

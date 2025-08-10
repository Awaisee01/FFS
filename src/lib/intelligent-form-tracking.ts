// Intelligent form tracking with advanced behavior analysis
import React from 'react';
import { getAdvancedTracker } from './advanced-pixel-tracking';

interface FormAnalytics {
  fieldInteractions: Record<string, number>;
  timeSpentOnFields: Record<string, number>;
  errorFields: string[];
  completionTime: number;
  abandonmentPoint?: string;
  validationErrors: string[];
  retryAttempts: number;
}

interface SmartFormOptions {
  trackFieldLevel?: boolean;
  trackValidationErrors?: boolean;
  trackAbandonmentPrediction?: boolean;
  enableHeatmap?: boolean;
  enableAutoSave?: boolean;
}

class IntelligentFormTracker {
  private formElement: HTMLFormElement;
  private analytics: FormAnalytics;
  private options: SmartFormOptions;
  private startTime: number;
  private currentField: string | null = null;
  private fieldStartTime: number = 0;
  private abandonmentTimer: NodeJS.Timeout | null = null;
  private autoSaveTimer: NodeJS.Timeout | null = null;

  constructor(formElement: HTMLFormElement, options: SmartFormOptions = {}) {
    this.formElement = formElement;
    this.options = {
      trackFieldLevel: true,
      trackValidationErrors: true,
      trackAbandonmentPrediction: true,
      enableHeatmap: true,
      enableAutoSave: true,
      ...options
    };

    this.startTime = Date.now();
    this.analytics = {
      fieldInteractions: {},
      timeSpentOnFields: {},
      errorFields: [],
      completionTime: 0,
      validationErrors: [],
      retryAttempts: 0
    };

    this.initializeTracking();
  }

  private initializeTracking(): void {
    this.trackFormStart();
    this.setupFieldTracking();
    this.setupValidationTracking();
    this.setupAbandonmentPrediction();
    this.setupAutoSave();
  }

  private trackFormStart(): void {
    const tracker = getAdvancedTracker();
    if (tracker) {
      tracker.trackEvent('FormStart', {
        content_name: `${this.getFormType()} Form Start`,
        content_category: `${this.getFormType()}_form`,
        form_id: this.formElement.id || 'unknown',
        form_type: this.getFormType(),
        field_count: this.getFormFields().length
      });
    }
  }

  private getFormType(): string {
    const pathname = window.location.pathname.toLowerCase();
    if (pathname.includes('/eco4')) return 'eco4';
    if (pathname.includes('/solar')) return 'solar';
    if (pathname.includes('/gas-boilers')) return 'gas_boilers';
    if (pathname.includes('/home-improvements')) return 'home_improvements';
    return 'contact';
  }

  private getFormFields(): HTMLInputElement[] {
    return Array.from(this.formElement.querySelectorAll('input, textarea, select'));
  }

  private setupFieldTracking(): void {
    if (!this.options.trackFieldLevel) return;

    const fields = this.getFormFields();
    
    fields.forEach(field => {
      const fieldName = field.name || field.id || field.type;

      // Track focus events
      field.addEventListener('focus', () => {
        this.currentField = fieldName;
        this.fieldStartTime = Date.now();
        this.analytics.fieldInteractions[fieldName] = (this.analytics.fieldInteractions[fieldName] || 0) + 1;
        
        // Clear abandonment timer when user interacts
        if (this.abandonmentTimer) {
          clearTimeout(this.abandonmentTimer);
          this.abandonmentTimer = null;
        }
      });

      // Track blur events
      field.addEventListener('blur', () => {
        if (this.currentField === fieldName) {
          const timeSpent = Date.now() - this.fieldStartTime;
          this.analytics.timeSpentOnFields[fieldName] = 
            (this.analytics.timeSpentOnFields[fieldName] || 0) + timeSpent;
          
          this.currentField = null;
          this.setupAbandonmentTimer();
        }
      });

      // Track input events for completion prediction
      field.addEventListener('input', () => {
        this.predictFormCompletion();
        
        if (this.options.enableAutoSave) {
          this.scheduleAutoSave();
        }
      });
    });
  }

  private setupValidationTracking(): void {
    if (!this.options.trackValidationErrors) return;

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Look for error messages
            if (element.classList.contains('error') || 
                element.getAttribute('role') === 'alert' ||
                element.textContent?.toLowerCase().includes('error')) {
              
              const nearestField = this.findNearestField(element);
              if (nearestField) {
                const fieldName = nearestField.name || nearestField.id || nearestField.type;
                this.analytics.errorFields.push(fieldName);
                this.analytics.validationErrors.push(element.textContent || 'Unknown error');
                
                const tracker = getAdvancedTracker();
                if (tracker) {
                  tracker.trackEvent('FormValidationError', {
                    content_name: `${this.getFormType()} Validation Error`,
                    content_category: `${this.getFormType()}_form`,
                    field_name: fieldName,
                    error_message: element.textContent,
                    retry_attempt: this.analytics.retryAttempts++
                  });
                }
              }
            }
          }
        });
      });
    });

    observer.observe(this.formElement, {
      childList: true,
      subtree: true
    });
  }

  private findNearestField(element: Element): HTMLInputElement | null {
    // Find the nearest form field to an error message
    let current = element.parentElement;
    while (current && current !== this.formElement) {
      const field = current.querySelector('input, textarea, select') as HTMLInputElement;
      if (field) return field;
      current = current.parentElement;
    }
    return null;
  }

  private setupAbandonmentPrediction(): void {
    if (!this.options.trackAbandonmentPrediction) return;
    this.setupAbandonmentTimer();
  }

  private setupAbandonmentTimer(): void {
    if (this.abandonmentTimer) {
      clearTimeout(this.abandonmentTimer);
    }

    // Predict abandonment if no interaction for 30 seconds
    this.abandonmentTimer = setTimeout(() => {
      this.trackFormAbandonment();
    }, 30000);
  }

  private trackFormAbandonment(): void {
    const completionPercentage = this.calculateCompletionPercentage();
    
    this.analytics.abandonmentPoint = this.currentField || 'unknown';
    this.analytics.completionTime = Date.now() - this.startTime;

    const tracker = getAdvancedTracker();
    if (tracker) {
      tracker.trackEvent('FormAbandonment', {
        content_name: `${this.getFormType()} Form Abandonment`,
        content_category: `${this.getFormType()}_form`,
        completion_percentage: completionPercentage,
        abandonment_point: this.analytics.abandonmentPoint,
        time_before_abandonment: this.analytics.completionTime,
        field_interactions: Object.keys(this.analytics.fieldInteractions).length,
        validation_errors: this.analytics.validationErrors.length,
        value: 0 // Abandonments have negative value
      });
    }
  }

  private calculateCompletionPercentage(): number {
    const fields = this.getFormFields();
    const filledFields = fields.filter(field => {
      if (field.type === 'checkbox' || field.type === 'radio') {
        return field.checked;
      }
      return field.value.trim() !== '';
    });
    
    return Math.round((filledFields.length / fields.length) * 100);
  }

  private predictFormCompletion(): void {
    const completionPercentage = this.calculateCompletionPercentage();
    
    // Track milestones
    if (completionPercentage >= 25 && completionPercentage < 50) {
      this.trackMilestone('25PercentComplete');
    } else if (completionPercentage >= 50 && completionPercentage < 75) {
      this.trackMilestone('50PercentComplete');
    } else if (completionPercentage >= 75 && completionPercentage < 100) {
      this.trackMilestone('75PercentComplete');
    }
  }

  private trackMilestone(milestone: string): void {
    const tracker = getAdvancedTracker();
    if (tracker) {
      tracker.trackEvent('FormProgress', {
        content_name: `${this.getFormType()} ${milestone}`,
        content_category: `${this.getFormType()}_form`,
        progress_milestone: milestone,
        time_to_milestone: Date.now() - this.startTime,
        field_interactions: Object.keys(this.analytics.fieldInteractions).length
      });
    }
  }

  private setupAutoSave(): void {
    if (!this.options.enableAutoSave) return;

    // Auto-save form data every 10 seconds
    this.autoSaveTimer = setInterval(() => {
      this.saveFormData();
    }, 10000);
  }

  private scheduleAutoSave(): void {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }

    this.autoSaveTimer = setTimeout(() => {
      this.saveFormData();
    }, 2000);
  }

  private saveFormData(): void {
    try {
      const formData: Record<string, string> = {};
      const fields = this.getFormFields();
      
      fields.forEach(field => {
        if (field.type !== 'password') { // Don't save passwords
          const fieldName = field.name || field.id || field.type;
          formData[fieldName] = field.value;
        }
      });

      localStorage.setItem(`form_autosave_${this.getFormType()}`, JSON.stringify({
        data: formData,
        timestamp: Date.now(),
        url: window.location.href
      }));
    } catch (error) {
      console.warn('Failed to auto-save form data:', error);
    }
  }

  public restoreFormData(): boolean {
    try {
      const saved = localStorage.getItem(`form_autosave_${this.getFormType()}`);
      if (!saved) return false;

      const { data, timestamp, url } = JSON.parse(saved);
      
      // Only restore if saved within last hour and on same page
      if (Date.now() - timestamp > 3600000 || url !== window.location.href) {
        localStorage.removeItem(`form_autosave_${this.getFormType()}`);
        return false;
      }

      const fields = this.getFormFields();
      let restored = false;

      fields.forEach(field => {
        const fieldName = field.name || field.id || field.type;
        if (data[fieldName] && !field.value) {
          field.value = data[fieldName];
          restored = true;
        }
      });

      if (restored) {
        const tracker = getAdvancedTracker();
        if (tracker) {
          tracker.trackEvent('FormDataRestored', {
            content_name: `${this.getFormType()} Auto-restore`,
            content_category: `${this.getFormType()}_form`,
            restored_fields: Object.keys(data).length
          });
        }
      }

      return restored;
    } catch (error) {
      console.warn('Failed to restore form data:', error);
      return false;
    }
  }

  public trackFormSubmission(success: boolean, submissionData?: any): void {
    this.analytics.completionTime = Date.now() - this.startTime;
    
    const tracker = getAdvancedTracker();
    if (tracker) {
      if (success) {
        tracker.trackLead({
          content_name: `${this.getFormType()} Form Submission`,
          content_category: `${this.getFormType()}_conversion`,
          email: submissionData?.email,
          phone: submissionData?.phone,
          firstName: submissionData?.fullName?.split(' ')[0],
          lastName: submissionData?.fullName?.split(' ').slice(1).join(' '),
          postcode: submissionData?.postCode
        });

        // Clear auto-saved data on successful submission
        localStorage.removeItem(`form_autosave_${this.getFormType()}`);
      } else {
        tracker.trackEvent('FormSubmissionFailed', {
          content_name: `${this.getFormType()} Submission Failed`,
          content_category: `${this.getFormType()}_form`,
          completion_time: this.analytics.completionTime,
          retry_attempts: this.analytics.retryAttempts,
          validation_errors: this.analytics.validationErrors.length,
          value: 0
        });
      }
    }

    // Generate detailed analytics report
    this.generateAnalyticsReport();
  }

  private generateAnalyticsReport(): void {
    const report = {
      formType: this.getFormType(),
      completionTime: this.analytics.completionTime,
      fieldInteractions: this.analytics.fieldInteractions,
      timeSpentOnFields: this.analytics.timeSpentOnFields,
      errorFields: this.analytics.errorFields,
      validationErrors: this.analytics.validationErrors,
      retryAttempts: this.analytics.retryAttempts,
      completionPercentage: this.calculateCompletionPercentage(),
      abandonmentPoint: this.analytics.abandonmentPoint
    };

    
    // Send to analytics if needed
    try {
      localStorage.setItem(`form_analytics_${Date.now()}`, JSON.stringify(report));
    } catch (error) {
      console.warn('Failed to save analytics report:', error);
    }
  }

  public cleanup(): void {
    if (this.abandonmentTimer) {
      clearTimeout(this.abandonmentTimer);
    }
    
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }
  }
}

// Factory function to create form tracker
export const createIntelligentFormTracker = (
  formElement: HTMLFormElement, 
  options?: SmartFormOptions
): IntelligentFormTracker => {
  return new IntelligentFormTracker(formElement, options);
};

// Hook for React components
export const useIntelligentFormTracking = (formRef: React.RefObject<HTMLFormElement>, options?: SmartFormOptions) => {
  const [tracker, setTracker] = React.useState<IntelligentFormTracker | null>(null);

  React.useEffect(() => {
    if (formRef.current) {
      const formTracker = createIntelligentFormTracker(formRef.current, options);
      
      // Try to restore auto-saved data
      formTracker.restoreFormData();
      
      setTracker(formTracker);

      return () => {
        formTracker.cleanup();
      };
    }
  }, [formRef, options]);

  return {
    tracker,
    trackSubmission: tracker?.trackFormSubmission.bind(tracker),
    restoreData: tracker?.restoreFormData.bind(tracker)
  };
};
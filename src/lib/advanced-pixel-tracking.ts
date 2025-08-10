// Advanced Facebook Pixel tracking with intelligent event management
import { sendToConversionsAPI } from './conversions-api';

interface AdvancedTrackingOptions {
  enableServerSide?: boolean;
  enableDeduplication?: boolean;
  enableBehaviorTracking?: boolean;
  enablePerformanceTracking?: boolean;
  enableErrorTracking?: boolean;
}

interface UserBehavior {
  timeOnPage: number;
  scrollDepth: number;
  clicks: number;
  formInteractions: number;
  pageViews: number;
  sessionDuration: number;
}

interface AdvancedEventData {
  content_name: string;
  content_category: string;
  value?: number;
  currency?: string;
  event_source?: string;
  user_behavior?: Partial<UserBehavior>;
  page_performance?: {
    load_time: number;
    dom_ready_time: number;
    first_paint_time: number;
  };
  [key: string]: any;
}

class AdvancedPixelTracker {
  private options: AdvancedTrackingOptions;
  private userBehavior: UserBehavior;
  private startTime: number;
  private eventQueue: Array<{ eventName: string; data: AdvancedEventData; eventId: string }> = [];
  private isOnline: boolean = navigator.onLine;
  private sessionId: string;

  constructor(options: AdvancedTrackingOptions = {}) {
    this.options = {
      enableServerSide: false, // Disabled due to missing credentials
      enableDeduplication: true,
      enableBehaviorTracking: false, // Disabled to reduce API calls
      enablePerformanceTracking: false, // Disabled to reduce API calls
      enableErrorTracking: false, // Disabled to reduce API calls
      ...options
    };

    this.startTime = Date.now();
    this.sessionId = this.generateSessionId();
    this.userBehavior = {
      timeOnPage: 0,
      scrollDepth: 0,
      clicks: 0,
      formInteractions: 0,
      pageViews: 1,
      sessionDuration: 0
    };

    this.initializeTracking();
  }

  private initializeTracking(): void {
    if (typeof window === 'undefined') return;

    // Track user behavior
    if (this.options.enableBehaviorTracking) {
      this.setupBehaviorTracking();
    }

    // Track performance metrics
    if (this.options.enablePerformanceTracking) {
      this.trackPagePerformance();
    }

    // Track errors
    if (this.options.enableErrorTracking) {
      this.setupErrorTracking();
    }

    // Handle offline/online state
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushEventQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Flush queue before page unload
    window.addEventListener('beforeunload', () => {
      this.flushEventQueue();
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(eventName: string): string {
    return `${eventName}_${this.sessionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupBehaviorTracking(): void {
    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        this.userBehavior.scrollDepth = scrollPercent;
        
        // Track milestone scroll events
        if (scrollPercent >= 25 && scrollPercent < 50) {
          this.trackEvent('ScrollDepth25', { scroll_depth: 25 });
        } else if (scrollPercent >= 50 && scrollPercent < 75) {
          this.trackEvent('ScrollDepth50', { scroll_depth: 50 });
        } else if (scrollPercent >= 75 && scrollPercent < 90) {
          this.trackEvent('ScrollDepth75', { scroll_depth: 75 });
        } else if (scrollPercent >= 90) {
          this.trackEvent('ScrollDepth90', { scroll_depth: 90 });
        }
      }
    };

    window.addEventListener('scroll', this.debounce(trackScroll, 250), { passive: true });

    // Track clicks
    document.addEventListener('click', (e) => {
      this.userBehavior.clicks++;
      
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.closest('a');
        this.trackEvent('LinkClick', {
          content_name: 'Link Click',
          content_category: 'engagement',
          link_url: link?.href || '',
          link_text: link?.textContent?.trim() || ''
        });
      }
    });

    // Track form interactions
    document.addEventListener('input', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        this.userBehavior.formInteractions++;
      }
    });

    // Track time on page
    setInterval(() => {
      this.userBehavior.timeOnPage += 1000;
      this.userBehavior.sessionDuration = Date.now() - this.startTime;
    }, 1000);
  }

  private trackPagePerformance(): void {
    if ('performance' in window && 'timing' in performance) {
      const timing = performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
      const firstPaintTime = performance.getEntriesByType('paint')
        .find(entry => entry.name === 'first-paint')?.startTime || 0;

      setTimeout(() => {
        this.trackEvent('PagePerformance', {
          content_name: 'Page Performance',
          content_category: 'performance',
          load_time: loadTime,
          dom_ready_time: domReadyTime,
          first_paint_time: firstPaintTime,
          value: Math.max(1, Math.round(5000 / loadTime)) // Higher value for faster pages
        });
      }, 1000);
    }
  }

  private setupErrorTracking(): void {
    window.addEventListener('error', (e) => {
      this.trackEvent('JavaScriptError', {
        content_name: 'JavaScript Error',
        content_category: 'error',
        error_message: e.message,
        error_file: e.filename,
        error_line: e.lineno,
        value: 0 // Errors have 0 value
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      this.trackEvent('PromiseRejection', {
        content_name: 'Promise Rejection',
        content_category: 'error',
        error_reason: e.reason?.toString() || 'Unknown',
        value: 0
      });
    });
  }

  private getEnhancedEventData(baseData: AdvancedEventData): AdvancedEventData {
    const urlParams = new URLSearchParams(window.location.search);
    const stored = localStorage.getItem('user_location');
    const storedLocation = stored ? JSON.parse(stored) : {};
    const utmData = this.getUTMData();

    return {
      ...baseData,
      // Session data
      session_id: this.sessionId,
      // Page context
      page_type: this.getPageType(),
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer,
      // Location data
      postcode: urlParams.get('postcode') || storedLocation.postcode,
      county: urlParams.get('county') || storedLocation.county,
      // UTM data
      ...utmData,
      // User behavior
      ...(this.options.enableBehaviorTracking && {
        user_behavior: { ...this.userBehavior }
      }),
      // Timing
      time_on_page: this.userBehavior.timeOnPage,
      session_duration: this.userBehavior.sessionDuration,
      // Browser info
      user_agent: navigator.userAgent,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      screen_width: screen.width,
      screen_height: screen.height,
      // Standard fields
      currency: baseData.currency || 'GBP',
      value: typeof baseData.value === 'number' ? baseData.value : 1
    };
  }

  private getPageType(): string {
    const pathname = window.location.pathname.toLowerCase();
    if (pathname === '/' || pathname === '/index') return 'homepage';
    if (pathname.includes('/eco4')) return 'eco4_landing';
    if (pathname.includes('/solar')) return 'solar_landing';
    if (pathname.includes('/gas-boilers')) return 'gas_boilers_landing';
    if (pathname.includes('/home-improvements')) return 'home_improvements_landing';
    if (pathname.includes('/contact')) return 'contact_page';
    return 'other_page';
  }

  private getUTMData() {
    try {
      const stored = localStorage.getItem('utm_data');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  public trackEvent(eventName: string, eventData: Partial<AdvancedEventData> = {}): void {
    try {
      const eventId = this.generateEventId(eventName);
      const enhancedData = this.getEnhancedEventData({
        content_name: eventData.content_name || 'Unknown',
        content_category: eventData.content_category || 'general',
        ...eventData
      });


      // Browser pixel tracking
      if (typeof window !== 'undefined' && (window as any).fbq) {
        const cleanData = { ...enhancedData };
        delete cleanData.user_behavior; // Remove complex objects for browser pixel
        
        (window as any).fbq('track', eventName, cleanData);
      }

      // Server-side tracking
      if (this.options.enableServerSide) {
        if (this.isOnline) {
          sendToConversionsAPI(eventName, enhancedData, eventId).catch(console.error);
        } else {
          // Queue for later if offline
          this.eventQueue.push({ eventName, data: enhancedData, eventId });
        }
      }

      // Store event for deduplication if enabled
      if (this.options.enableDeduplication) {
        this.storeEventForDeduplication(eventId, eventName);
      }

    } catch (error) {
      console.error('❌ ADVANCED PIXEL: Tracking failed', error);
    }
  }

  private storeEventForDeduplication(eventId: string, eventName: string): void {
    try {
      const stored = localStorage.getItem('pixel_events') || '{}';
      const events = JSON.parse(stored);
      events[eventId] = { eventName, timestamp: Date.now() };
      
      // Clean old events (older than 24 hours)
      const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
      Object.keys(events).forEach(id => {
        if (events[id].timestamp < dayAgo) {
          delete events[id];
        }
      });
      
      localStorage.setItem('pixel_events', JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to store event for deduplication:', error);
    }
  }

  private flushEventQueue(): void {
    if (this.eventQueue.length === 0) return;
    
    
    this.eventQueue.forEach(({ eventName, data, eventId }) => {
      sendToConversionsAPI(eventName, data, eventId).catch(console.error);
    });
    
    this.eventQueue = [];
  }

  // Specialized tracking methods
  public trackLead(data: {
    content_name: string;
    content_category: string;
    value?: number;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    postcode?: string;
  }): void {
    const leadValue = this.generateDynamicLeadValue(data.content_category);
    
    this.trackEvent('Lead', {
      ...data,
      value: data.value || leadValue,
      currency: 'GBP', // ALWAYS include 3-letter currency code
      em: data.email?.toLowerCase(),
      ph: data.phone?.replace(/\D/g, ''),
      fn: data.firstName?.toLowerCase(),
      ln: data.lastName?.toLowerCase(),
      zp: data.postcode?.replace(/\s/g, '').toLowerCase()
    });
  }

  public trackViewContent(data: {
    content_name: string;
    content_category: string;
    value?: number;
  }): void {
    this.trackEvent('ViewContent', {
      ...data,
      event_source: 'page_view'
    });
  }

  public trackInitiateCheckout(data: {
    content_name: string;
    content_category: string;
    value?: number;
  }): void {
    this.trackEvent('InitiateCheckout', {
      ...data,
      event_source: 'form_interaction'
    });
  }

  private generateDynamicLeadValue(contentCategory: string): number {
    // Realistic lead values for Facebook Pixel (must be within reasonable range)
    const serviceValues: Record<string, number[]> = {
      'eco4': [15, 20, 25, 30, 35, 40],
      'solar': [40, 50, 60, 70, 80, 90],
      'gas_boilers': [20, 25, 30, 35, 40, 45],
      'home_improvements': [25, 30, 35, 40, 45, 50]
    };

    const key = Object.keys(serviceValues).find(k => 
      contentCategory.toLowerCase().includes(k.replace('_', ''))
    ) || 'eco4';

    const values = serviceValues[key];
    return values[Math.floor(Math.random() * values.length)];
  }
}

// Global instance
let advancedTracker: AdvancedPixelTracker | null = null;

export const initializeAdvancedTracking = (options?: AdvancedTrackingOptions): AdvancedPixelTracker => {
  if (!advancedTracker && typeof window !== 'undefined') {
    advancedTracker = new AdvancedPixelTracker(options);
  }
  return advancedTracker!;
};

export const getAdvancedTracker = (): AdvancedPixelTracker | null => advancedTracker;

// Convenience exports
export const trackAdvancedLead = (data: any) => advancedTracker?.trackLead(data);
export const trackAdvancedViewContent = (data: any) => advancedTracker?.trackViewContent(data);
export const trackAdvancedInitiateCheckout = (data: any) => advancedTracker?.trackInitiateCheckout(data);
export const trackAdvancedEvent = (eventName: string, data: any) => advancedTracker?.trackEvent(eventName, data);
export class Analytics {
  private logs: any[];
  private enabled: boolean;

  constructor() {
    this.logs = [];
    this.enabled = process.env.NODE_ENV !== "production";
  }

  log(message: string, metadata?: Record<string, any>) {
    if (!this.enabled) return;
    const entry = { message, metadata, timestamp: new Date() };
    this.logs.push(entry);
    console.log(`[LOG] ${message}`, metadata);
  }

  error(error: Error, context = {}) {
    const entry = {
        timestamp: new Date(),
        error: error.message,
        stack: error.stack,
        context
    };
    this.logs.push(entry);
    console.error(`[ERROR]`, entry);
    // Hata izleme servisine gonderilebilir. or: Sentry
  }

  trackEvent(eventName: string, payload = {}) {
    this.log(`Event: ${eventName}`, payload);
    // Bir analitik servisine gonderilebilir. or: Google Analytics
  }

  getLogs() {
    return this.logs;
  }
}

export default new Analytics();
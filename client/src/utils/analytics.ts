// Minimal analytics utility: records page views and events.
// Replace console calls with real analytics integrations (GA4, GTM) as needed.
type EventPayload = Record<string, any>;

export function trackPageView(url: string, extras?: EventPayload) {
  try {
    const payload = { url, timestamp: Date.now(), ...(extras || {}) };
    // Default implementation: log to console. Replace with network call.
    console.info("analytics.page_view", payload);

    // Example: send to a backend endpoint
    // navigator.sendBeacon && navigator.sendBeacon('/_collect', JSON.stringify(payload));
  } catch (e) {
    // swallow errors to avoid breaking the app
  }
}

export function trackEvent(name: string, data?: EventPayload) {
  try {
    const payload = { name, data: data || {}, timestamp: Date.now() };
    console.info("analytics.event", payload);
  } catch (e) {}
}

export default { trackPageView, trackEvent };

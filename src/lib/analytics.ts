// Google Analytics utility
// Uses NEXT_PUBLIC_MEASUREMENT_ID from .env.local

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID || "";

// Track page views
export const pageview = (url: string) => {
    if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;
    (window as any).gtag?.("config", GA_MEASUREMENT_ID, {
        page_path: url,
    });
};

// Track custom events
export const event = (
    action: string,
    params?: Record<string, any>
) => {
    if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;
    (window as any).gtag?.("event", action, params);
};

// --- Pre-defined event helpers ---

export const trackSignIn = (method: string) =>
    event("login", { method });

export const trackSignUp = (method: string) =>
    event("sign_up", { method });

export const trackProjectCreate = (projectName: string) =>
    event("project_create", { project_name: projectName });

export const trackProjectDelete = (projectId: string) =>
    event("project_delete", { project_id: projectId });

export const trackFormSubmission = (projectId: string) =>
    event("form_submission_received", { project_id: projectId });

export const trackCopyEndpoint = (projectId: string) =>
    event("copy_endpoint", { project_id: projectId });

export const trackThemeChange = (theme: string) =>
    event("theme_change", { theme });

export const trackDocSection = (section: string) =>
    event("doc_section_view", { section });

export const trackCTAClick = (ctaName: string, location: string) =>
    event("cta_click", { cta_name: ctaName, location });

export const trackAdminAction = (action: string, details?: string) =>
    event("admin_action", { action, details });

export const trackEmailThemePreview = (themeId: string) =>
    event("email_theme_preview", { theme_id: themeId });

export const trackTabSwitch = (tab: string) =>
    event("tab_switch", { tab });

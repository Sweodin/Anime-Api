// Utility for tracking and optimizing Largest Contentful Paint
export const observeLCP = (callback) => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1];
        callback(lcpEntry);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    return () => observer.disconnect();
};

// Preload critical assets
export const preloadAsset = (url, type = 'image') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = type;
    link.href = url;
    document.head.appendChild(link);
};

// Priority hints for images
export const addPriorityHint = (imgElement) => {
    if (imgElement && 'fetchPriority' in imgElement) {
        imgElement.fetchPriority = 'high';
    }
};

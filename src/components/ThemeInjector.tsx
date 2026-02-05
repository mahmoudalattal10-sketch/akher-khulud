
import { useEffect } from 'react';
import brandConfig from '../config/brandConfig';

/**
 * This component reads the brand configuration and applies the colors
 * to the CSS variables at the root level.
 * This allows changing the theme purely from the JS config.
 */
export const ThemeInjector = () => {
    useEffect(() => {
        const root = document.documentElement;

        // Helper to set color with optional alpha
        const setColor = (name: string, value: string) => {
            root.style.setProperty(name, value);
        };

        // Apply Core Colors
        setColor('--primary', brandConfig.colors.primary.DEFAULT);
        setColor('--gold', brandConfig.colors.primary.DEFAULT);
        setColor('--gold-light', brandConfig.colors.primary.light);
        setColor('--gold-dark', brandConfig.colors.primary.dark);

        setColor('--secondary', brandConfig.colors.secondary.DEFAULT);
        setColor('--slate-900', brandConfig.colors.secondary.DEFAULT);

        setColor('--accent', brandConfig.colors.accent);

        // Update Document Title
        document.title = brandConfig.meta.title;

        // SEO Meta Description (Optional: if we want to inject it dynamically)
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', brandConfig.meta.description);
        } else {
            const meta = document.createElement('meta');
            meta.name = "description";
            meta.content = brandConfig.meta.description;
            document.head.appendChild(meta);
        }

        // Theme Color Meta
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', brandConfig.meta.themeColor);
        }

    }, []);

    return null; // This component renders nothing
};

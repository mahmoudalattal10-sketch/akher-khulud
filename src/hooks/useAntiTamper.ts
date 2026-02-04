import { useEffect } from 'react';

/**
 * 🛡️ CYBERSECURITY SHIELD: Global Anti-Tamper Hook
 * Disables context menu (Right-click) and critical DevTools shortcuts
 * across the entire application to prevent unauthorized modification.
 */
export const useAntiTamper = () => {
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            // Allow context menu only on input/textarea if needed, 
            // but for maximum lockdown we disable it globally.
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // 🚫 BLOCK LIST:
            // F12: Open DevTools
            // Ctrl+Shift+I: Inspect
            // Ctrl+Shift+J: Console
            // Ctrl+Shift+C: Element Picker
            // Ctrl+U: View Source
            // Ctrl+S: Save Page
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                (e.ctrlKey && e.key === 'U') ||
                (e.ctrlKey && e.key === 'S')
            ) {
                e.preventDefault();
                return false;
            }
        };

        // Apply Protection
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        // Cleanup
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
};

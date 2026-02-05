export const brandConfig = {
    brandName: "diaftkhulud",
    tagline: "Experience Luxury Like Never Before",

    // Contact Information
    contact: {
        email: "Diyafaat.khulood@outlook.sa",
        phone: "+966 055 388 2445",
        address: "Kingdom of Saudi Arabia",
    },

    // Social Media Links
    social: {
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
    },

    // Assets
    logo: {
        primary: "/logo.png", // Updated to new logo
        favicon: "/favicon.ico",
    },

    // Color Palette (These values should match your CSS variables in design-system.css)
    // This object is mainly for usage in JS/TS files where CSS vars might not be accessible directly
    // or for dynamic theme switching logic in the future.
    colors: {
        primary: {
            DEFAULT: '#C5A059', // Gold-500
            light: '#E5C686',   // Gold-300
            dark: '#8E7036',    // Gold-700
        },
        secondary: {
            DEFAULT: '#0F172A', // Slate-900
            light: '#334155',   // Slate-700
        },
        accent: '#10B981',    // Emerald-500
    },

    // Meta information for SEO
    meta: {
        title: "diaftkhulud - Luxury Hotel Booking",
        description: "Book your stay at top-rated hotels with diaftkhulud.",
        themeColor: "#C5A059",
    }
};

export default brandConfig;

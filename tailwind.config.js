/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./contexts/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // 🎨 STRICT USER PALETTE (2026)
                // 1. #D6B372 (Primary Gold)
                // 2. #0f172a (Secondary Dark)
                // 3. #94a3b8 (Text Light)
                // 4. #059669 (Accent Green)

                primary: '#D6B372',
                secondary: '#0f172a',

                text: '#0f172a',       // Dark Headings
                textLight: '#94a3b8',  // Light Paragraphs

                border: '#94a3b8',
                accent: '#059669',
                success: '#059669',

                // Minimal Aliases for Compatibility
                gold: {
                    DEFAULT: '#D6B372',
                    light: '#E5C992',
                    dark: '#B59450',
                    '50': '#fbf6e9',
                    '100': '#f7edcd',
                    '200': '#eed893',
                    '300': '#e3bd5e',
                    '400': '#d6b372',
                    '500': '#c5a059',
                    '600': '#a88248',
                    '700': '#8a683d',
                    '800': '#725537',
                    '900': '#614932',
                },
                slate: {
                    DEFAULT: '#0f172a',
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    primary: '#0f172a',
                    secondary: '#D6B372',
                    action: '#059669',
                    text: '#0f172a',
                    textLight: '#64748b',
                    border: '#cbd5e1',
                    'luxury-gradient': 'linear-gradient(135deg, #f8fafc 0%, #dfc798 100%)',
                    'brand-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    'gold-shine': 'linear-gradient(135deg, #c5a059 0%, #dfc798 100%)',
                    'hero-pattern': 'radial-gradient(ellipse at top right, rgba(15, 23, 42, 0.05) 0%, transparent 50%)',
                },
            },
            boxShadow: {
                'ios': '0 10px 30px -5px rgba(15, 23, 42, 0.05)',
                'brand': '0 10px 40px -10px rgba(15, 23, 42, 0.2)',
                'gold': '0 10px 40px -10px rgba(197, 160, 89, 0.2)',
                'luxury': '0 20px 50px -12px rgba(15, 23, 42, 0.12)',
                'inner-gold': 'inset 0 2px 4px 0 rgba(214, 179, 114, 0.06)',
            },
            fontFamily: {
                sans: ['Cairo', 'sans-serif'],
                cairo: ['Cairo', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            transitionTimingFunction: {
                'ios': 'cubic-bezier(0.32, 0.72, 0, 1)',
                'ios-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                'reveal': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
            animation: {
                'shimmer': 'shimmer 2s infinite linear',
                'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                },
                fadeInUp: {
                    'from': { opacity: '0', transform: 'translateY(20px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
};

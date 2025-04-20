/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'dark-bg': '#0a0a0a',
                'glass': 'rgba(255, 255, 255, 0.05)',
                'glass-border': 'rgba(255, 255, 255, 0.1)',
                'primary': '#3b82f6',
                'primary-hover': '#2563eb',
            },
            backdropBlur: {
                'glass': '8px',
            },
            boxShadow: {
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
            },
            borderRadius: {
                'glass': '16px',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
} 
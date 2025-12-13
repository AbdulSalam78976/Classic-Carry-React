/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#e6dcd6',
                    DEFAULT: '#d2c1b6',
                    dark: '#b8a599',
                },
                dark: {
                    bg: '#0f172a', // Slate 900
                    surface: '#1e293b', // Slate 800
                    border: '#334155', // Slate 700
                },
                glass: {
                    border: 'rgba(255, 255, 255, 0.1)',
                    surface: 'rgba(30, 41, 59, 0.7)', // Slate 800 with opacity
                    highlight: 'rgba(255, 255, 255, 0.05)',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
                logo: ['Satisfy', 'cursive'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'neon': '0 0 10px rgba(210, 193, 182, 0.5), 0 0 20px rgba(210, 193, 182, 0.3)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}

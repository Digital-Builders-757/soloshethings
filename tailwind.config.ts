import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'surface-card',
    'image-clean',
    'overlay-neutral-vignette',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          peach: "rgb(var(--brand-peach-rgb) / <alpha-value>)",
          coral: "rgb(var(--brand-coral-rgb) / <alpha-value>)",
          blush: "rgb(var(--brand-blush-rgb) / <alpha-value>)",
          sage: "rgb(var(--brand-sage-rgb) / <alpha-value>)",
          navy: "rgb(var(--brand-navy-rgb) / <alpha-value>)",
          cream: "rgb(var(--brand-cream-rgb) / <alpha-value>)",
          /* Legacy aliases */
          blue1: "rgb(var(--brand-blue-1-rgb) / <alpha-value>)",
          blue2: "rgb(var(--brand-blue-2-rgb) / <alpha-value>)",
          yellow1: "rgb(var(--brand-yellow-1-rgb) / <alpha-value>)",
          yellow2: "rgb(var(--brand-yellow-2-rgb) / <alpha-value>)",
          orange: "rgb(var(--brand-orange-rgb) / <alpha-value>)",
          pink: "rgb(var(--brand-pink-rgb) / <alpha-value>)",
          pinkDark: "rgb(var(--brand-pink-dark-rgb) / <alpha-value>)",
        },
        neutral: {
          50: "rgb(var(--neutral-50) / <alpha-value>)",
          100: "rgb(var(--neutral-100) / <alpha-value>)",
          200: "rgb(var(--neutral-200) / <alpha-value>)",
          300: "rgb(var(--neutral-300) / <alpha-value>)",
          400: "rgb(var(--neutral-400) / <alpha-value>)",
          500: "rgb(var(--neutral-500) / <alpha-value>)",
          600: "rgb(var(--neutral-600) / <alpha-value>)",
          700: "rgb(var(--neutral-700) / <alpha-value>)",
          800: "rgb(var(--neutral-800) / <alpha-value>)",
          900: "rgb(var(--neutral-900) / <alpha-value>)",
          950: "rgb(var(--neutral-950) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '4xl': '2rem',    // 32px
      },
      fontFamily: {
        sans: ["var(--font-rokkitt)", "Georgia", "serif"],
        serif: ["var(--font-rokkitt)", "Georgia", "serif"],
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],   // 56px
        'display-lg': ['2.75rem', { lineHeight: '1.15', fontWeight: '700' }], // 44px
        'display-md': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],  // 36px
      },
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      transitionDuration: {
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
        'slow': 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        'in-out': 'var(--ease-in-out)',
        'out': 'var(--ease-out)',
        'in': 'var(--ease-in)',
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(4, 57, 217, 0.35), 0 0 40px rgba(242, 226, 5, 0.2)",
          },
          "50%": {
            boxShadow:
              "0 0 30px rgba(4, 57, 217, 0.55), 0 0 60px rgba(242, 135, 5, 0.3)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "text-glow": {
          "0%, 100%": { textShadow: "0 0 10px rgba(4, 57, 217, 0.45)" },
          "50%": {
            textShadow:
              "0 0 20px rgba(4, 57, 217, 0.7), 0 0 30px rgba(242, 226, 5, 0.45)",
          },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(-1deg)' },
        },
        'float-fast': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        'gentle-rise': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gentle-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'gentle-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 8s ease infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "text-glow": "text-glow 2s ease-in-out infinite",
        marquee: "marquee 20s linear infinite",
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'float-medium': 'float-medium 4s ease-in-out infinite',
        'float-fast': 'float-fast 3s ease-in-out infinite',
        'gentle-rise': 'gentle-rise 1s ease-out forwards',
        'gentle-glow': 'gentle-glow 2s ease-in-out infinite',
        'gentle-pulse': 'gentle-pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [typography],
};

export default config;

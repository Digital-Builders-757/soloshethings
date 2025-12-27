import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Custom utility classes from @layer utilities in globals.css
    // These must be safelisted to prevent tree-shaking
    'focus-ring',
    'btn-glow',
    'surface-card',
    'surface-glass',
    'lift-hover',
    'hairline-border',
    'section-divider',
    'hero-wash',
    'postcard-media',
    'postcard-caption',
    'eyebrow-text',
    'narrative-interlude',
    'animate-float-slow',
    'animate-float-medium',
    'animate-float-fast',
    'animate-gentle-rise',
    'animate-text-flow',
    'animate-gentle-glow',
    'animate-gentle-pulse',
    'animate-fade-in',
    'animate-slide-up',
    'animate-scale-in',
    'animate-spin-slow',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue1: "rgb(var(--brand-blue-1) / <alpha-value>)",
          blue2: "rgb(var(--brand-blue-2) / <alpha-value>)",
          yellow1: "rgb(var(--brand-yellow-1) / <alpha-value>)",
          yellow2: "rgb(var(--brand-yellow-2) / <alpha-value>)",
          orange: "rgb(var(--brand-orange) / <alpha-value>)",
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
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
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
      borderRadius: {
        '4xl': '2rem',    // 32px
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
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'float-medium': 'float-medium 4s ease-in-out infinite',
        'float-fast': 'float-fast 3s ease-in-out infinite',
        'gentle-rise': 'gentle-rise 1s ease-out forwards',
        'gentle-glow': 'gentle-glow 2s ease-in-out infinite',
        'gentle-pulse': 'gentle-pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;


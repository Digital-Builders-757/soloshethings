import type { Config } from "tailwindcss"
import typography from "@tailwindcss/typography"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
<<<<<<< HEAD
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
          blue1: "rgb(var(--brand-blue-1) / <alpha-value>)",
          blue2: "rgb(var(--brand-blue-2) / <alpha-value>)",
          yellow1: "rgb(var(--brand-yellow-1) / <alpha-value>)",
          yellow2: "rgb(var(--brand-yellow-2) / <alpha-value>)",
          orange: "rgb(var(--brand-orange) / <alpha-value>)",
=======
>>>>>>> 01834d0 (feat(design): match white background sections to founder section style (#4))
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
<<<<<<< HEAD
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '4xl': '2rem',    // 32px
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
=======
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "system-ui", "sans-serif"],
        serif: ["var(--font-raleway)", "Georgia", "serif"],
>>>>>>> 01834d0 (feat(design): match white background sections to founder section style (#4))
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(219, 112, 147, 0.3), 0 0 40px rgba(64, 224, 208, 0.2)" },
          "50%": { boxShadow: "0 0 30px rgba(219, 112, 147, 0.5), 0 0 60px rgba(64, 224, 208, 0.3)" },
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
          "0%, 100%": { textShadow: "0 0 10px rgba(219, 112, 147, 0.5)" },
          "50%": { textShadow: "0 0 20px rgba(219, 112, 147, 0.8), 0 0 30px rgba(64, 224, 208, 0.5)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 8s ease infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "text-glow": "text-glow 2s ease-in-out infinite",
        marquee: "marquee 20s linear infinite",
      },
    },
  },
  plugins: [typography],
}

export default config
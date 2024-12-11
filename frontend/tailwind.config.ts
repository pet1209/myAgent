import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '10px',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'hsl(var(--card-foreground))',
        },
        primaryColor: '#c3c3c3',
        secondaryColor: '#6f6f6f',
        brandRed: '#ED2139',
        darkPrimary: '#141414',
        darkSecondary: '#001222',
        darkSecondary2: '#222222',
        darkSecondary3: '#181818',
        darkText: '#6f6f6f',
      },
      backgroundImage: {
        'card-gradient': 'var(--card-gradient)',
        'card-gradient-on': 'var(--card-gradient-on)',
        'card-gradient-menu': 'var(--card-gradient-menu)',
        'card-gradient-menu-on': 'var(--card-gradient-menu-on)',
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
        tlblD: '0 0 20px 20px',
        trbrD: '20px 20px 0 0',
        MSG: '0 15px 15px',
        MSGME: '15px 0 15px 15px',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        satoshi: ['var(--font-satoshi)'],
        roboto: ['var(--font-roboto)'],
      },
      boxShadow: {
        footer: '0 -4px 52px rgba(0, 0, 0, 0.15)',
        header: '0 4px 52px rgba(0, 0, 0, 0.15)',
        panel: '0 0 10px -7px rgb(0, 0, 0)',
      },
      keyframes: {
        text: {
          to: {
            backgroundPosition: '200% center',
          },
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        slide: {
          '0%': { transform: 'translateY(100%)', opacity: 0.1 },
          '15%': { transform: 'translateY(0)', opacity: 1 },
          '30%': { transform: 'translateY(0)', opacity: 1 },
          '45%': { transform: 'translateY(-100%)', opacity: 1 },
          '100%': { transform: 'translateY(-100%)', opacity: 0.1 },
        },
      },
      animation: {
        'text-gradient': 'text 1.5s linear infinite',
        slide: 'slide 2.5s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('tailwindcss-animate')],
};

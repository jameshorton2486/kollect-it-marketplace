import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic mappings using HSL ramps defined in globals.css (collision-proof)
        ink: {
          DEFAULT: 'hsl(var(--ink-900))',
          secondary: 'hsl(var(--ink-700))',
          muted: 'hsl(var(--ink-500))',
          inverted: 'hsl(var(--ink-inverted))',
        },
        gold: {
          DEFAULT: 'hsl(var(--gold-500))',
          hover: 'hsl(var(--gold-600))',
          subtle: 'hsl(var(--gold-200))',
        },
        surface: {
          DEFAULT: 'hsl(var(--surface-0))',
          1: 'hsl(var(--surface-1))',
          2: 'hsl(var(--surface-2))',
          3: 'hsl(var(--surface-3))',
        },
        cta: {
          DEFAULT: 'hsl(var(--cta-500))',
          hover: 'hsl(var(--cta-600))',
          ring: 'hsl(var(--cta-400))',
        },
        link: {
          DEFAULT: 'hsl(var(--link-600))',
          hover: 'hsl(var(--link-700))',
          visited: 'hsl(var(--link-700))',
        },
        'border-neutral': {
          DEFAULT: 'hsl(var(--border-300))',
          strong: 'hsl(var(--border-400))',
        },
        // 1stdibs Luxury Palette
        white: '#FFFFFF',
        'off-white': '#F9F9F9',
  cream: '#F5F3F0',
        charcoal: '#1E1E1E',
        'muted-gold': '#C7A85E',
        'deep-navy': '#1C2233',
        'gray-light': '#E5E5E5',
        'gray-medium': '#999999',
        'gray-dark': '#666666',

        // Shadcn variables
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      boxShadow: {
        'elevation-sm': 'var(--shadow-sm)',
        'elevation-md': 'var(--shadow-md)',
        'elevation-lg': 'var(--shadow-lg)',
        'focus': 'var(--shadow-focus)'
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'Cormorant Garamond', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Lato', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      },
      spacing: {
        'luxury-xs': 'var(--spacing-xs)',
        'luxury-sm': 'var(--spacing-sm)',
        'luxury-md': 'var(--spacing-md)',
        'luxury-lg': 'var(--spacing-lg)',
        'luxury-xl': 'var(--spacing-xl)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.75' }],
        lg: ['1.125rem', { lineHeight: '1.75' }],
        xl: ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.25' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.25' }],
      },
      // Additional radii independent of shadcn radius var
      borderRadiusScale: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    }
  },
  plugins: [animate],
} satisfies Config;

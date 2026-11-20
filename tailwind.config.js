/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--bg-paper)',
        'moss-soft': 'var(--bg-moss-soft)',
        'ink-primary': 'var(--ink-primary)',
        'ink-muted': 'var(--ink-muted)',
        'accent-botanical': 'var(--accent-botanical)',
        'accent-earth': 'var(--accent-earth)',
        forest: {
          50: '#f2f7f4',
          100: '#e1ede5',
          200: '#c5dccc',
          300: '#9ec2a9',
          400: '#71a380',
          500: '#4e865f',
          600: '#3c6c4c',
          700: 'var(--accent-botanical)',
          800: '#274732',
          900: 'var(--ink-primary)',
        },
      },
      fontFamily: {
        serif: ['var(--font-heading)', 'var(--font-be-vietnam)', 'sans-serif'],
        sans: ['var(--font-body)', 'var(--font-be-vietnam)', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(26, 36, 30, 0.05)',
        'elevated': '0 10px 30px rgba(26, 36, 30, 0.08)',
        'float': '0 20px 40px rgba(26, 36, 30, 0.12)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
};


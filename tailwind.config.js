/** @type {import('tailwindcss').Config} */
module.exports = {
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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          light: "#EEF2FF",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gap: {
          weak: {
            bg: "#FEF2F2",
            border: "#FCA5A5",
            text: "#991B1B",
            badge: "#EF4444",
          },
          medium: {
            bg: "#FFFBEB",
            border: "#FCD34D",
            text: "#92400E",
            badge: "#F59E0B",
          },
          strong: {
            bg: "#F0FDF4",
            border: "#86EFAC",
            text: "#166534",
            badge: "#10B981",
          },
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

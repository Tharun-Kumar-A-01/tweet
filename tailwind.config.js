/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
			colors : {
				background: "#000000", // or DEFAULT
				foreground: "#ECEDEE", // or 50 to 900 DEFAULT
				primary: "#00a6ff",
				secondary:"#52a8ff",
				success: "#17c964",
				warning: "#f5a524",
				danger: "#f31260",
				default: "#3f3f46",

			}
    },
  },
  plugins: [],
};

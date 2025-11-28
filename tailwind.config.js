/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}",
     "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        dm: ['DMSans-Regular', 'sans-serif'],
        "dm-medium": ['DMSans-Medium', 'sans-serif'],
        "dm-semibold": ['DMSans-SemiBold', 'sans-serif'],
        "dm-bold": ['DMSans-Bold', 'sans-serif'],
        "dm-extrabold": ['DMSans-ExtraBold', 'sans-serif'],
        "dm-black": ['DMSans-Black', 'sans-serif'],
        "dm-light": ['DMSans-Light', 'sans-serif'],
        "dm-thin": ['DMSans-Thin', 'sans-serif'],
        "dm-italic": ['DMSans-Italic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

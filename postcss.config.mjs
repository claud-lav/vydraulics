import postcssNested from "postcss-nested";

export default {
  plugins: {
    "postcss-nested": postcssNested,
    "@tailwindcss/postcss": {},
  },
};

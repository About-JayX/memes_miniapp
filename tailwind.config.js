/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  darkMode: "class",
  content: [
    "./index.html",
    "./src/*.{vue,js,ts,jsx,tsx}",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pulseScale: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.9)" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(-10px)', opacity: '0.5' },
          '50%': { transform: 'translateY(10px)', opacity: '1' },
        },
      },
      animation: {
        pulseScale: 'pulseScale 3s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite'
      },
    },
  },
  plugins: [],
  safelist: [...generateSafelist()],
};

// Function to generate safelist
function generateSafelist() {
  const spanCount = 12;
  const maxGap = 99;
  const heightStep = 1; // Step size for height
  const maxHeight = 999; // Set an upper limit for height
  const breakpoints = ["", "sm:", "md:", "lg:", "xl:", "2xl:"];

  // Generate span, gap, and height classes
  const spanClasses = generateClasses("col-span-", spanCount, breakpoints);
  const gapClasses = generateClasses("gap-[", maxGap, breakpoints, "px]");
  const lineClampClasses = generateClasses(
    "line-clamp-[",
    maxGap,
    breakpoints,
    "]"
  );
  const heightClasses = generateHeightClasses(
    heightStep,
    maxHeight,
    breakpoints
  );
  const maxHeightClasses = generateMaxHeightClasses(
    heightStep,
    maxHeight,
    breakpoints
  );

  return Array.from(
    new Set([
      ...spanClasses,
      ...gapClasses,
      ...lineClampClasses,
      ...heightClasses,
      ...maxHeightClasses,
    ])
  );
}

// Function to generate height classes
function generateHeightClasses(step, max, breakpoints) {
  const heights = Array.from(
    { length: Math.floor(max / step) + 1 },
    (_, i) => i * step
  );
  return breakpoints.flatMap((prefix) =>
    heights.map((height) => `${prefix}h-[calc(100vh-${height}px)]`)
  );
}

function generateMaxHeightClasses(step, max, breakpoints) {
  const heights = Array.from(
    { length: Math.floor(max / step) + 1 },
    (_, i) => i * step
  );
  return breakpoints.flatMap((prefix) =>
    heights.map((height) => `${prefix}max-h-[calc(100vh-${height}px)]`)
  );
}

// Function to generate classes
function generateClasses(base, count, breakpoints, suffix = "") {
  return breakpoints.flatMap((prefix) =>
    Array.from({ length: count }, (_, i) => `${prefix}${base}${i + 1}${suffix}`)
  );
}

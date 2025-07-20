import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts", "./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8", // or 'istanbul' if you prefer
      reporter: ["text", "json", "html"],
      all: true,
      exclude: [
        ...configDefaults.exclude,
        "src/setupTests.ts",
        "auth/**",
        "mocks/**",
        "server/**",
        "engine/**",
      ],
    },
  },
});

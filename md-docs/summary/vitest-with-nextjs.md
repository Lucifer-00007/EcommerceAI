# Vitest Integration with Next.js

**Vitest** is being used purely as a **test runner**, replacing alternatives like Jest. It is increasingly common in the Next.js ecosystem because it is faster and easier to configure than Jest.

**Key Clarifications:**
1.  **Application Build**: Next.js (Webpack/Turbopack) is still responsible for building, serving, and compiling your React application (via `npm run dev`, `npm run build`).
2.  **Test Runner**: Vitest is used *only* when you run `npm run test`. It uses its own internal bundler (powered by Vite's logic) to process files for testing, but this is completely isolated from your production build.

Your `vitest.config.ts` confirms this isolation:
```typescript
export default defineConfig({
  // ... aliases for @/ imports
  test: {
    environment: "node", // Runs tests in a Node environment
    include: ["src/**/*.test.ts"], // Only targets test files
  },
});
```

This is a standard, modern configuration for testing Next.js applications. You can safely keep it.
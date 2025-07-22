> 🚨 **Important:**  
> Before you start the app, **please** make sure you’ve completed **all** of the steps in the **Run Node Server** section mention in README.ms file.  
> Skipping these may cause errors when you try to launch the frontend or backend.

### 1. How much time did you spend on the engineering task?

~14–15 hours total.

**Rough breakdown (approx.):**

- Environment/setup & reading requirements: ~1h
- Core implementation (drag/drop, panels, workspace logic): ~6h
- Refactoring & performance tweaks (hooks, memoization, reducer): ~3h
- Writing/fixing unit tests (Vitest + RTL mocks/hoisting issues): ~3h
- Debugging & polishing (styles, event wiring, misc fixes): ~1–2h

### 2. What would you add to your solution if you’d had more time?

- **Persisted layouts & settings**  
  Save/restore panel positions, sizes, and open panels (plus theme) to localStorage or a backend.

- **Better drag/resize UX**

  - Ghost preview of drop target & snap-to-grid animation
  - Pointer Events + touch support for mobile/tablet
  - rAF-throttled move/resize handlers to cut re-renders

- **Advanced panel features**

  - Keyboard-accessible dragging/resizing and full a11y labels

- **State management & architecture**  
  Migrate panel/state logic to Zustand or Redux Toolkit for clearer separation and easier testing.

- **Testing depth**

  - Cypress/Playwright E2E flows (drag/drop, logout timer)
  - More hook/component edge-case tests (errors, race conditions)

- **Performance audits**  
  Use more performance technics.

- **Styling & theming**

  - System-preference detection (`prefers-color-scheme`)
  - CSS variables for all panel/nav styles + Storybook docs

- **Error handling & resilience**  
  Error boundaries around panels, graceful fallbacks if localStorage unavailable.

### 3. What do you think is the most useful feature added to the latest version of JS/TS?

**a. Include a code snippet that shows how you've used it.**

I’d argue that the combination of **optional chaining** (`?.`) and **nullish coalescing** (`??`) is the most immediately useful addition in modern JavaScript/TypeScript. Together, they let you collapse nested null/undefined checks into a single, readable expression.

#### Example from the codebase (`MainWorkspace.tsx`)

```ts
useEffect(() => {
  const updateSize = () => {
    // Safely read offsetWidth/offsetHeight; default to 0 when ref is null/undefined
    const width  = workspaceRef.current?.offsetWidth  ?? 0;
    const height = workspaceRef.current?.offsetHeight ?? 0;
    setContainerSize({ width, height });
  };

  // Initial size calculation
  updateSize();
  // Re-calculate on window resize
  window.addEventListener("resize", updateSize);

  return () => {
    window.removeEventListener("resize", updateSize);
  };
}, []);


**TypeScript – `const` type parameters (TS 5.0+)**

They let you lock a generic parameter the same way `as const` locks a value, preserving literal types without awkward overloads or helper wrappers.


### 4. How would you track down a performance issue in production?
**a. Have you ever had to do this?**

Yes, I’ve had to troubleshoot production performance issues multiple times, particularly during my work at **DBS Bank** and **OCBC**, where performance and user experience were mission-critical.

#### 🔍 My Approach:

1. **Reproduce or isolate the issue**
   - Use tools like **Chrome DevTools**, **Lighthouse**, or **WebPageTest** to capture traces.
   - Analyze metrics such as **Time to Interactive (TTI)**, **First Contentful Paint (FCP)**, and **Largest Contentful Paint (LCP)**.

2. **Check live monitoring tools**
   - Use tools like **Cloudflare**, or dashboards powered by **Grafana/Kibana**.
   - Analyze request timings, TTFB, and frontend/backend splits.

3. **Narrow down bottlenecks**
   - Profile JS execution time and React re-renders using **React DevTools**.
   - Identify heavy components, layout thrashing, or expensive operations.
   - Inspect bundle sizes with **Webpack Bundle Analyzer** or **source-map-explorer**.

4. **Fix, test, and monitor**
   - Apply fixes like **code splitting**, **memoization**, **lazy loading**, and **debouncing**.
   - Optimize image delivery (WebP), reduce unused libraries, and throttle expensive effects.
   - Validate improvements against performance budgets.

#### ✅ Real Example

While working on the **LiveBetter** platform at **DBS Bank**, I optimized carbon footprint visualizations that were impacting mobile load times. By batching React state updates and refining our REST payload

```

### Test coverage

------------------------------|---------|----------|---------|---------|---------------------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s  
------------------------------|---------|----------|---------|---------|---------------------------------
All files | 93.9 | 90.3 | 72.83 | 93.9 |

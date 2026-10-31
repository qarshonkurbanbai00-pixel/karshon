# Verification report

## Tested build

The included source was installed and built in a Linux environment with Node.js 22.23.4 and npm 10.9.9. `npm install`, `npm ci`, and `npm run build` completed successfully. The final Vite production build completed with no build warnings. A production dependency audit reported zero known vulnerabilities at verification time.

The browser tests ran against `npm run preview`, serving the actual `dist` build, not against the development server. Browser: Playwright Chromium 156, using software WebGL. This report describes the tested environments; it is not a claim of testing every browser or device.

## Functional browser checks

1. **PASS** — Production page and WebGL canvas render.
2. **PASS** — All seven requested content sections exist.
3. **PASS** — All anchor links point to real sections.
4. **PASS** — 3D pause, play, reset and keyboard controls.
5. **PASS** — All six skill cards update detail content.
6. **PASS** — Add to roadmap connects skills explorer to plan.
7. **PASS** — Four-week checklist and completion progress.
8. **PASS** — Selected skill and progress persist after reload.
9. **PASS** — Download plan produces a real text file.
10. **PASS** — Reset progress and switching skill plans.
11. **PASS** — All four challenge disclosures reveal advice.
12. **PASS** — Full quiz: answer locking, feedback and perfect scoring.
13. **PASS** — Quiz review displays all five explained answers.
14. **PASS** — Quiz retry resets state and incorrect answers score zero.
15. **PASS** — No horizontal overflow at 320, 360, 390, 768, 1024, 1440 and 1920px.
16. **PASS** — Mobile menu opens, links work, menu closes.
17. **PASS** — Escape dismisses mobile navigation.
18. **PASS** — No browser runtime errors or failed HTTP resources.
19. **PASS** — WebGL unavailable and localStorage blocked: fallback and controls work.
20. **PASS** — Clicking a visible Three.js node with a real pointer raycast updates both the selected-skill label and the skills detail panel.
21. **PASS** — Roadmap tabs support arrow keys, Home, and End with correct focus and selection changes.
22. **PASS** — Initial desktop accessibility scan: zero automated violations in the selected WCAG 2 A/AA and WCAG 2.1 AA checks.
23. **PASS** — Initial mobile accessibility scan: zero automated violations in the selected checks.
24. **PASS** — Mobile quiz answer-feedback accessibility scan: zero automated violations in the selected checks.

The quiz results/review state was also scanned with axe-core and returned zero automated violations. Automated accessibility scanning is not a full accessibility certification and does not replace manual assistive-technology testing.

## Layout checks

- No horizontal page overflow at viewport widths 320, 360, 390, 768, 1024, 1440, and 1920 pixels.
- Desktop and mobile screenshots were visually inspected for layout, content, and successful 3D rendering.
- No uncaught browser runtime exceptions or failed HTTP resource responses were observed during the main production test flow.
- A second browser context disabled WebGL and denied localStorage access: the static orbital fallback, checklist, and rest of the page still worked.
- Reduced-motion preference was used in the functional and accessibility checks. The animated desktop scene was separately rendered and visually inspected.

## Production output

The final build separates the app, animation library, React Three Fiber, Three.js core, and Three.js renderer into hashed chunks. The two largest minified JavaScript chunks are approximately 376 KB and 335 KB (approximately 102 KB and 83 KB gzipped). There are no remote image, font, or model requests.

## Retesting after changes

1. Use Node.js 22.12 or later.
2. Run `npm ci` and `npm run build` from the folder containing `package.json`.
3. Run `npm run preview` and open the printed URL.
4. Select each of the six skills; add one to the roadmap; complete a week; reload and verify it remains checked.
5. Save the plan and open the downloaded text file. Reset progress.
6. Open each challenge and read its advice.
7. Complete the quiz, review the results, and retry it.
8. Use the 3D pause, play, reset, arrow-key, drag, and node-selection controls.
9. Check a narrow mobile viewport and its navigation menu.

No test-only packages or browser binaries are required for deploying this project. The testing environment is not included in the runtime or ZIP.

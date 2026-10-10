# Anil Kumar — SAP Integration Architect Portfolio

Live: https://ruvunk44-dotcom.github.io/anil-kumar-portfolio/

Stack: Vite 5, React 18, TypeScript, Framer Motion, three.js / @react-three/fiber (lazy-loaded hero), custom SVG architecture diagrams, light/dark theme.

## Run locally
```
npm ci
npm run dev        # dev server
npm run typecheck && npm run lint
npm run build      # outputs dist/ (relative base './')
npm run preview    # serves dist on :4173
RESUME_CODE=... npm test   # Playwright e2e against the preview
```

Deployment: every push to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.

The resume is served only as an encrypted file (`public/assets/resume.enc`) and is decrypted in the browser with an access code.

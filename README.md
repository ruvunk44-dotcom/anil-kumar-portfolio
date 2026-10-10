# Anil Kumar — Cinematic Portfolio (Vite + React + TypeScript)
npm install
npm run dev        # local dev
npm run typecheck && npm run lint
npm run build      # outputs dist/ (relative base './', deploy as static folder)
npm run preview    # serves dist on :4173
npm test           # Playwright e2e against the preview (URL env to override)
Content lives in src/data/content.ts (facts copied verbatim from the previous site/resume).
Final visual overrides live in src/cinematic.css. HeroScene.tsx renders the lazy-loaded 3D sphere; hooks/motion.tsx controls ambient motion. The default respects device reduced-motion settings; visitors can opt in with Enable motion.
The local server at http://localhost:8080 serves ../dist. After building, copy this project's dist contents to ../dist to update that server. The served build before this enhancement is preserved in ../dist_before_cinematic.
Verification for this enhancement: TypeScript and Vite production build passed; desktop 1440px, mobile 390px, dark/light themes, architecture selection, mobile navigation and protected resume modal checked in the browser. Legacy test scripts retain their original Linux paths and should be adapted before use on Windows.
Resume lock: src/components/ResumeLock.tsx decrypts public/assets/resume.enc; change code with ../tools/encrypt_resume.py.

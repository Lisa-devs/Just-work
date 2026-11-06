# Just Work prototype (frontend only)
Run: `npm install && npm run dev`. Build: `npm run build`.
Demo: on the sign-in screen pick a demo account (admin, manager, member, responder). Header selects switch workspace and role.
Structure: `app/` (single route), `components/App.tsx` (shell/state), `components/screens/*`, `components/ui.tsx`, `lib/types`, `lib/mock-data`.
State: React state + localStorage key `jw-demo-v1` (demo prefs and alert only). Not secure storage.
Backend seams: auth -> Auth.tsx; roles/tenant isolation -> App.tsx role/orgId (server claims + RLS); files -> Member.tsx Files; messages -> Messages (E2EE needs expert design); Code Red -> CodeRed.tsx (server dispatch/escalation); audit -> Admin.tsx Activity.

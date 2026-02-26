# ChargePoint Junk Fee Scanner

Scan your ChargePoint account for hidden fees, idle charges, and session surcharges.

**Live app:** [chargepoint-junkfees.pages.dev](https://chargepoint-junkfees.pages.dev)

## What it finds

- **Parking/Idle fees** — charges for time spent connected after charging completes
- **Flat session fees** — per-session surcharges on top of energy rates
- **Minimum charge adjustments** — fees added when usage falls below a station minimum

## How it works

1. You log in to [driver.chargepoint.com](https://driver.chargepoint.com) and copy your `auth-session` cookie
2. The app scans all your monthly statements (2018–present) to find every charging session
3. It fetches the itemized receipt for each session and flags extra fees
4. Results are shown in-browser with export to PDF and CSV

Your token is only used to proxy requests to ChargePoint's API through a Cloudflare edge worker. Nothing is stored, logged, or persisted.

## Tech stack

- [Hono](https://hono.dev) — lightweight web framework
- [Cloudflare Pages](https://pages.cloudflare.com) — hosting and edge functions
- [Vite](https://vite.dev) — build tool
- Vanilla HTML/CSS/JS frontend (single file, no framework)

## Development

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run deploy
```

Deploys to Cloudflare Pages via Wrangler. The deploy script builds with Vite and overwrites `_routes.json` to route only `/api/*` to the worker (static files are served directly by Pages).

## License

MIT

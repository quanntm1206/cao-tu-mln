# Capaccumulate — public hosting

## Live URL (no password — share with friends)

| | |
|---|---|
| **Site** | https://behaviour-tap-redhead-presents.trycloudflare.com |
| **Type** | Cloudflare Quick Tunnel (temporary; no uptime guarantee) |
| **Password** | None — open link and play |

Deployed **2026-06-23** from `dist/` via `serve` on port **4173** + `cloudflared tunnel --url http://localhost:4173`.

### Keep the tunnel alive (this machine)

While the quick tunnel runs, the URL stays up. If the link stops working, rebuild and restart:

```bash
cd /home/minhquan/capaccumulate
npm run build
# static server (SPA) on 4173 — stop any old serve on 4173 first if needed
npx serve -s dist -l 4173 &
/tmp/cloudflared tunnel --url http://localhost:4173
# Copy the https://….trycloudflare.com URL from cloudflared output
```

### Verify (must be HTTP 200, no password POST)

```bash
curl -sS -o /dev/null -w "%{http_code}\n" \
  "https://behaviour-tap-redhead-presents.trycloudflare.com"
# Expected: 200
```

## Permanent hosting (not active on this machine)

| Provider | Result |
|----------|--------|
| GitHub Pages | `gh` not logged in — run `gh auth login`, then `gh repo create capaccumulate-mln --public --source=. --remote=origin --push` and add Pages workflow |
| Cloudflare Pages | `CLOUDFLARE_API_TOKEN` not set |
| Netlify (token) | `NETLIFY_AUTH_TOKEN` not set |
| Netlify Drop (anonymous) | Daily anonymous deploy limit reached |
| Vercel | No `VERCEL_TOKEN` / login in this session |
| Surge | `SURGE_TOKEN` not set |

### Previous Netlify Drop (password required — do not share)

- https://earnest-gaufre-6f28ff.netlify.app — gated with drop password `My-Drop-Site` until claimed on Netlify.

## SPA fallback files

- `public/_redirects` → copied to `dist/` (Netlify / Cloudflare)
- `netlify.toml` → `/*` → `/index.html` (200)
- `vercel.json` → rewrite all routes to `index.html`

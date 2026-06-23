# Capaccumulate — public hosting

## Live URL (Netlify Drop — claim required for permanence)

| | |
|---|---|
| **Site** | https://earnest-gaufre-6f28ff.netlify.app |
| **Drop password** (until claimed) | `My-Drop-Site` |
| **Claim deadline** | Within **60 minutes** of deploy (~2026-06-23 21:33 ICT) |

### Claim this site (makes it permanent on your Netlify account)

1. Open (while logged into Netlify or sign up free):  
   https://app.netlify.com/drop/earnest-gaufre-6f28ff#drop_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3ODIyMjUxODgsImV4cCI6MTc4MjIyODc4OCwiaXNzIjoiTmV0bGlmeSIsInNlc3Npb25faWQiOiJiMjM0YmFiZi04MjY2LTRmOTItYjBkNC0xMDNhOTIxYTc5MWUifQ.UR2eNlXtZqTqhoGMt6iqoesrvkIZgr9Q3MUw9cYwDuQ

2. Or CLI after `netlify login`:  
   ```bash
   netlify claim --site 9d13e215-3135-452e-84d7-298bf145bf60 --token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3ODIyMjUxODgsImV4cCI6MTc4MjIyODc4OCwiaXNzIjoiTmV0bGlmeSIsInNlc3Npb25faWQiOiJiMjM0YmFiZi04MjY2LTRmOTItYjBkNC0xMDNhOTIxYTc5MWUifQ.UR2eNlXtZqTqhoGMt6iqoesrvkIZgr9Q3MUw9cYwDuQ
   ```

3. After claim: rename site to `capaccumulate` in Netlify UI if desired; drop password is removed; SPA redirects from `netlify.toml` + `public/_redirects` apply on future deploys.

### Verify with curl (drop password gate)

```bash
curl -s -c /tmp/nf.txt -b /tmp/nf.txt -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "form-name=form 1" \
  --data-urlencode "password=My-Drop-Site" \
  "https://earnest-gaufre-6f28ff.netlify.app/" -o /dev/null
curl -s -b /tmp/nf.txt "https://earnest-gaufre-6f28ff.netlify.app/" | head -5
```

## Hosting attempts (this machine)

| Provider | Result |
|----------|--------|
| GitHub Pages | `gh` not logged in |
| Cloudflare Pages | `CLOUDFLARE_API_TOKEN` not set |
| Netlify (token) | `NETLIFY_AUTH_TOKEN` not set |
| Netlify Drop | **Deployed** (see above) |
| Firebase | no `firebase.json` |

## Redeploy after claim

```bash
cd /home/minhquan/capaccumulate
npm run build
npx netlify deploy --prod --dir=dist
```

Or set `NETLIFY_AUTH_TOKEN` and use the linked site in Netlify UI.

## SPA fallback files

- `public/_redirects` → copied to `dist/` (Netlify / Cloudflare)
- `netlify.toml` → `/*` → `/index.html` (200)
- `vercel.json` → rewrite all routes to `index.html`

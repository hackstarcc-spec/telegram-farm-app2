# CoinBarn — Telegram Mini App

Tap-to-earn farm clicker as a Telegram Mini App. Monorepo:

| Path | Role | Deploy |
|------|------|--------|
| `apps/web` | Next.js App Router + Tailwind + Telegram WebApp | **Vercel** |
| `apps/api` | NestJS + Prisma + PostgreSQL | **Railway** (API + Postgres in one project) |
| `packages/shared` | Economy v1 types/constants | consumed by web + api |

Temporary bot username: **`@CoinBarnBot`** → `https://t.me/CoinBarnBot?start=ref_<code>`

## Economy v1 (locked)

- Start: `0` coins · `100` energy · storage `5000` · farm `100/h` · tap `1` coin / `1` energy · regen `1` energy/sec
- Boosts (max 10): `farm_speed` +50/h @ `1000×1.5^(L-1)` · `storage` +5000 @ `500×1.5^(L-1)` · `energy_max` +100 @ `800×1.5^(L-1)`
- Daily streak: **UTC** calendar day · day1=`100` · `×1.5` · cap `5000` · miss resets
- Referral: **5% of friend's farm claim only** (not taps) → `referral_earnings` · invite/welcome defaults **500 / 200**

Server is source of truth. No real `BOT_TOKEN` / JWT secrets in this repo — only `.env.example` names.

## Local setup

```bash
# Node >= 20, pnpm 9
pnpm install

# Postgres + copy env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# Set DATABASE_URL, JWT_SECRET (or JWT_ACCESS_SECRET), BOT_TOKEN locally — never commit.

pnpm --filter @coinbarn/api prisma:generate
pnpm --filter @coinbarn/api prisma:migrate   # creates DB schema
pnpm --filter @coinbarn/api prisma:seed      # boosts + daily tiers + sample tasks

pnpm dev:api   # :3001
pnpm dev:web   # :3000
```

Health: `GET http://localhost:3001/api/v1/health`

## Deploy — Railway (API + PostgreSQL)

1. Create a Railway project.
2. Add a **PostgreSQL** plugin; copy `DATABASE_URL`.
3. Add a service from this repo; set **Root Directory** to repo root (or configure build to use workspaces).
4. Build / start (see `apps/api/railway.toml`):
   - Build: install → build `@coinbarn/shared` → `prisma generate` → `nest build`
   - Start: `prisma migrate deploy` → `node dist/main.js` (via `pnpm --filter @coinbarn/api start:prod`)
5. Set **Variables** (Railway → Variables). Do **not** put these in git:

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | from Postgres plugin |
| `BOT_TOKEN` | BotFather token (HMAC initData + getChatMember) |
| `JWT_SECRET` | or set `JWT_ACCESS_SECRET` + `JWT_REFRESH_SECRET` |
| `JWT_ACCESS_TTL` | e.g. `15m` |
| `JWT_REFRESH_TTL` | e.g. `30d` |
| `CORS_ORIGIN` | **only** your Vercel Mini App origin, e.g. `https://coinbarn.vercel.app` (no `*`) |
| `PORT` | Railway injects; Nest reads `PORT` |
| `REF_SHARE_PERCENT` | `5` |
| `REF_INVITE_BONUS` | `500` |
| `REF_WELCOME_BONUS` | `200` |
| `INITDATA_MAX_AGE_SEC` | `86400` |
| `TELEGRAM_CHANNEL_ID` | optional, for subscribe tasks |

6. Confirm `https://<railway-api>/api/v1/health` returns `{ ok: true }`.

**CORS:** `main.ts` allowlists `CORS_ORIGIN` only. Never use `*`.

## Deploy — Vercel (web)

1. Import the same Git repo into Vercel.
2. Framework: **Next.js**. Set **Root Directory** to `apps/web`.
3. Env:

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://<railway-api>/api/v1` |
| `NEXT_PUBLIC_BOT_USERNAME` | `CoinBarnBot` |

4. Deploy → copy production URL (HTTPS).
5. Put that exact origin into Railway `CORS_ORIGIN`.

## BotFather

1. Create / configure bot **`@CoinBarnBot`** (placeholder username — replace later if needed).
2. Set Menu Button / Web App URL = Vercel production URL.
3. Referral deep links: `https://t.me/CoinBarnBot?start=ref_<referral_code>`  
   `start_param` is also available in Mini App `initData`.

## API surface (prefix `/api/v1`)

- Auth: `POST /auth/telegram` · `POST /auth/refresh` · `POST /auth/logout`
- Farm: `GET /farm/state` · `POST /farm/sync` · `POST /farm/tap` · `POST /farm/claim`
- Boosts: `GET /boosts` · `POST /boosts/:boostId/buy`
- Tasks: `GET /tasks` · `POST /tasks/:taskId/check|claim`
- Referrals: `GET /referrals/me` · `GET /referrals/list`
- Leaderboard: `GET /leaderboard`
- Profile: `GET /profile/me` · `POST /profile/daily-claim`
- Health: `GET /health`

## Screens

Bottom nav: **Фарм · Бусты · Задания · Друзья · Профиль**

## Checklist before prod

- [ ] HTTPS on API and Web  
- [ ] `CORS_ORIGIN` = Vercel only; `BOT_TOKEN` + JWT secrets set on Railway  
- [ ] Prisma migrations applied  
- [ ] initData validated inside real Telegram client  
- [ ] `/api/v1/health` green  
- [ ] BotFather Web App URL points at Vercel  

## License

Private / TBD.

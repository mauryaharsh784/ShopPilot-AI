# ShopPilot AI — Agentic Commerce & Growth Platform

Razorpay AI Builder Internship 2026 · Track 1: **AI Growth & Agentic Commerce**

ShopPilot is not a storefront with a chatbot. It is an agent that understands a shopping (or growth) goal, chooses tools, reads the live catalog and analytics, explains its ranking, and takes **user-authorised** actions such as `addToCart`.

---

## Problem

Traditional e-commerce forces people to translate a need into filters:

**Search → Filter → Compare → Decide → Buy**

Merchants, meanwhile, drown in dashboards that do not recommend a next action.

## Solution

**Tell the agent what you need → it understands constraints → searches → compares → recommends → acts.**

Example:

> I need a laptop for coding under ₹70,000. I want at least 16GB RAM, good battery life, and preferably something lightweight.

ShopPilot extracts structured filters, calls `searchProducts` / `findBestProductForBudget`, ranks against those constraints, and explains *why* the winner fits. Follow-ups such as “add the best one to my cart” execute `addToCart(productId)`.

---

## Why this is Agentic AI

1. Understands natural-language goals (budget, RAM, battery, setup themes).
2. Determines required actions (search, compare, bundle, mutate cart, analyse growth).
3. Selects tools from a typed registry — the UI does not fake the workflow.
4. Retrieves **real application data** (catalog, cart, orders, seeded analytics).
5. Reasons over tool results (ranking, leftover budget, conversion gaps).
6. Performs user-authorised actions (confirmation required to clear a cart).
7. Returns explainable results (constraint checklist, not “this is the best”).

```
User → Agent → Tool router → Tool → Service → Mongo/memory store → Result → Agent → User
```

If `AI_PROVIDER=mock` (default), a deterministic planner still **calls the same tools**. Flip to OpenAI or Groq and the model performs native function calling against the same registry.

---

## Key features

### Customer

- Conversational shopping agent with tool/action steps in the UI
- Product catalog: search, category, brand, price, rating, sort, pagination
- Product detail: specs, reviews, AI summary, related items
- Compare (up to 3) + AI explanation
- Cart with bundle insights, upsells, quantity controls, mock checkout
- Orders with timeline + “ask AI about my order”
- Light / dark theme

### Growth (merchant)

- Revenue, orders, conversion, AOV, abandoned carts, repeat customers
- Sales trend + category conversion charts
- Product performance table
- AI-labelled opportunities from **seeded demo analytics**
- Growth Advisor chat (`analyzeSales`, `identifyGrowthOpportunities`, `recommendBundle`, `recommendOffer`)

### Safety

- Destructive cart actions require confirmation
- Checkout is explicitly a **mock** — no real payments
- API keys never shipped to the frontend

---

## Architecture

```
shopilot-ai/
├── client/                 Vite + React + TypeScript + Tailwind
├── server/                 Express + TypeScript + Mongoose
│   ├── src/agents/         Orchestrator + mock planner + providers
│   ├── src/tools/          Tool definitions + handlers
│   ├── src/services/       Products, cart, orders, analytics, auth, NL
│   ├── src/models/         Mongoose schemas
│   └── src/data/store.ts   Mongo or in-memory JSON store
├── .env.example
└── README.md
```

**AI providers**

| `AI_PROVIDER` | Behaviour |
|---|---|
| `mock` (default) | Planner + real tools. Works offline. |
| `openai` | OpenAI Chat Completions + tools |
| `groq` | Groq OpenAI-compatible API |
| any + `AI_BASE_URL` | Other OpenAI-compatible endpoints |

---

## Tech stack

**Frontend:** React, Vite, TypeScript, Tailwind CSS, React Router, Lucide, TanStack Query, Recharts, Sonner  
**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, Zod, JWT  
**AI:** Provider interface · mock planner · OpenAI-compatible function calling

---

## Setup

### Prerequisites

- Node.js 20+
- npm 10+
- Optional: MongoDB 6+ or [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster

Mongo is **not required** to run locally. `MONGO_URI=memory` uses a JSON-backed store under `server/data/`.

### Install

```bash
npm install
```

### Environment

```bash
cp .env.example .env
```

```
PORT=4000
CLIENT_URL=http://localhost:5173
MONGO_URI=memory
JWT_SECRET=change-this-to-a-long-random-string
AI_PROVIDER=mock
AI_API_KEY=
AI_MODEL=gpt-4o-mini
AI_BASE_URL=
```

For Atlas or local Mongo:

```
MONGO_URI=mongodb+srv://USER:PASS@cluster/shopilot
# or
MONGO_URI=mongodb://127.0.0.1:27017/shopilot
```

Then seed:

```bash
npm run seed
```

### Run (development)

```bash
npm run dev
```

- Client: http://localhost:5173  
- API: http://localhost:4000/api/health  

Vite proxies `/api` to the server, so the browser never needs a public API URL locally.

### Production build

```bash
npm run build
npm run start
```

Serve `client/dist` from any static host and point `VITE_API_URL` at the API origin **at build time**.

---

## Demo credentials

| Role | Email | Password |
|---|---|---|
| Customer | `demo@shopilot.ai` | `Demo@123` |
| Merchant | `merchant@shopilot.ai` | `Merchant@123` |

One-click buttons on `/login` also exist.

---

## Demo prompts

**Shopping agent** (`/agent`)

1. Find me the best laptop under ₹70,000 for coding.
2. Add the best one to my cart.
3. Compare the best 3 smartphones under ₹30,000.
4. Build a work-from-home setup under ₹80,000.
5. Optimize my cart for the best value.

**Growth advisor** (`/dashboard`, merchant)

1. Why did conversion drop this week?
2. Which products should I promote?
3. Which products are frequently bought together?
4. Analyze this month's sales and tell me how to improve conversion.

---

## Enabling a real model

```
AI_PROVIDER=openai
AI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
```

Groq example:

```
AI_PROVIDER=groq
AI_API_KEY=gsk_...
AI_MODEL=llama-3.3-70b-versatile
AI_BASE_URL=https://api.groq.com/openai/v1
```

The mock badge in the agent header disappears when a key is present and `AI_PROVIDER` is not `mock`.

---

## API (selected)

```
POST /api/auth/register | login | demo
GET  /api/auth/me
GET  /api/products
GET  /api/products/:id
GET  /api/search?q=
GET  /api/recommendations
POST /api/products/compare
GET|POST|PATCH /api/cart
POST /api/orders          (mock checkout)
GET  /api/orders
POST /api/agent/chat
GET  /api/analytics       (merchant)
POST /api/growth/advisor  (merchant)
GET|PUT /api/preferences
```

---

## Deployment

**Frontend (Vercel)**  
Root: `client` · Build: `npm run build` · Output: `dist`  
Environment: `VITE_API_URL=https://your-api.example.com`

**Backend (Render / Railway)**  
Build: `npm install && npm run build -w server`  
Start: `npm run start -w server`  
Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel origin), and optional AI keys.  
Run `npm run seed` once against Atlas so demo users and analytics exist.

**MongoDB Atlas**  
Create a free cluster, allow the host IP (or `0.0.0.0/0` for a short demo), paste the URI into `MONGO_URI`.

Do not commit `.env`.

---

## Screenshots

Add evaluator screenshots here after a local run:

- `docs/screenshots/home.png` — landing (traditional vs agentic)
- `docs/screenshots/agent.png` — tool steps + recommendation cards
- `docs/screenshots/dashboard.png` — growth metrics + advisor

---

## GitHub notes

```bash
git init
git add .
git commit -m "feat: ShopPilot AI agentic commerce and growth platform"
```

Keep commits focused. Never commit `.env` or `server/data/store.json` if it contains local secrets (the store file is gitignored).

---

## Future improvements

- Streaming token + tool events over SSE
- Persistent user embeddings for personalization
- Real Razorpay checkout behind an explicit `ENABLE_PAYMENTS` flag
- Multi-turn memory of hard constraints across sessions
- A/B testing of AI-authored offers

---

## What this submission demonstrates

**AI + agentic workflows + commerce + personalization + growth analytics + real tool actions.**
#   S h o p P i l o t - A I  
 
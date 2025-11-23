# TinyLink

A small URL shortening service (TinyLink) built with Node.js + Express and PostgreSQL.

**Assignment PDF (reference):** `/mnt/data/Copy of Take-Home Assignment_ TinyLink (1) (2).pdf`. :contentReference[oaicite:1]{index=1}

---

## Live demo (public URL)
> https://tinylink-5qak.onrender.com

---

## Demo Video
Watch the full TinyLink walkthrough here:  
>https://drive.google.com/file/d/1rWoICJLMFkkGUo8hDJyFlRMIGZnxov3c/view?usp=drivesdk

---

## GitHub repo
> https://github.com/Dileep8221/tinyLink

---

## Table of Contents
- [What it does](#what-it-does)
- [Routes & API](#routes--api)
- [Database & Migrations](#database--migrations)
- [Setup — Local development](#setup---local-development)
- [Testing](#testing)
- [Deployment (Render / Railway / Neon)](#deployment-render--railway--neon)
- [Notes / Assumptions](#notes--assumptions)

---

## What it does
TinyLink supports:
- Create short links with optional custom codes (codes must match `^[A-Za-z0-9]{6,8}$`)
- Redirect `GET /:code` → **HTTP 302** to the target URL and atomically increments `total_clicks` and updates `last_clicked`
- Dashboard (`GET /`) and Stats (`GET /code/:code`) HTML pages
- Healthcheck: `GET /healthz` → `200` and JSON `{ "ok": true, "version": "1.0" }`
- API:
  - `POST /api/links` — create link (returns `201` with link object; `409` on duplicate code)
  - `GET /api/links` — list all links
  - `GET /api/links/:code` — link details (404 if not found)
  - `DELETE /api/links/:code` — delete link (204 No Content on success)

---

## Routes & API (autograder compatibility)
- `GET /` → Dashboard (HTML)
- `GET /code/:code` → Stats page (HTML)
- `GET /:code` → Redirect (HTTP 302) or 404
- `GET /healthz` → `200` `{ "ok": true, "version": "1.0" }`

API Endpoints:
- `POST /api/links`  
  Request JSON: `{ "target_url": "...", "code": "optionalCustomCode" }`  
  Validations: `target_url` required & must include scheme (`http`/`https`); `code` if present must match `^[A-Za-z0-9]{6,8}$`.  
  Responses: `201` created object; `400` on invalid input `{ "error": "message" }`; `409` if code exists `{ "error": "code already exists" }`.

- `GET /api/links` → `200` JSON array
- `GET /api/links/:code` → `200` link JSON or `404` `{ "error": "Not found" }`
- `DELETE /api/links/:code` → `204 No Content` (or `200` `{ "ok": true }`)

**Exact field names returned for a link object:**
```json
{ "id", "code", "target_url", "total_clicks", "created_at", "last_clicked" }

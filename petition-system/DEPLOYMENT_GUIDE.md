## Deploying to Render

### Prerequisites
- GitHub repository connected to Render
- A managed PostgreSQL instance on Render

### Environment Variables (Backend Service)
- DATABASE_URL
- JWT_SECRET
- JWT_EXPIRES_IN (e.g., 7d)
- OFFICIAL_LOGIN_CODE
- ADMIN_LOGIN_CODE
- NODE_ENV=production
- PORT=10000 (Render provides the port via env; Express should read from `process.env.PORT`)
- FRONTEND_URL (your static site URL)
- WHATSAPP_API_KEY (optional)
- WHATSAPP_BASE_URL (optional)

### Backend (Web Service)
- Build command: `npm --prefix backend install && npm --prefix backend run build || true`
- Start command: `npm --prefix backend start`
- Instance type: per your load

### Frontend (Static Site)
- Build command: `npm --prefix frontend install && npm --prefix frontend run build`
- Publish directory: `frontend/build`
- Environment: ensure API base URL is set in `frontend/.env` or replaced at build-time

### Database Migrations
- Run once on a Render Job or locally:
```
npm install
npm run migrate
```

### CORS
- Set `FRONTEND_URL` on backend. In development, use `http://localhost:3000`.

### Notes
- Never commit real secrets; use Render dashboard to set env vars.
- Enable autoscaling and logs retention as needed.
# WaslArtisan

WaslArtisan is a premium handcrafted ecommerce experience inspired by Moroccan artisan culture and a calm, minimal aesthetic. It includes a full customer storefront and an admin dashboard powered by an Express API with JWT authentication.

## Tech Stack

- React (Vite)
- React Router
- Zustand (state)
- Tailwind CSS
- Framer Motion
- Axios
- Express API (JWT + bcrypt)
- LowDB (JSON storage)

## Getting Started

Install dependencies:

```
npm install
```

Run the API server:

```
npm run api
```

Run the frontend:

```
npm run dev
```

Run both together:

```
npm run dev:all
```

## Environment Variables

Use the sample file in [.env.example](.env.example) to set environment values.

- `VITE_API_URL`: API base URL (example: `http://localhost:4000/api`).
- `VITE_UPLOAD_URL`: Upload base URL used to resolve `/uploads` paths (example: `http://localhost:4000`).
- `VITE_API_TIMEOUT`, `VITE_UPLOAD_TIMEOUT`: request timeouts in milliseconds.
- `API_PORT`, `CORS_ORIGINS`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `DB_PATH`, `DB_SEED_PATH`, `UPLOAD_DIR`, `UPLOAD_MAX_FILE_SIZE_MB`, `NODE_ENV`: API server settings.

## Production Build

Create an optimized build:

```
npm run build:prod
```

Preview the production build locally:

```
npm run preview:host
```

## Deployment (DigitalOcean)

### Docker (recommended)

1. Configure `.env` with your production values (see `.env.example`).
2. Build and run the stack:

```
docker-compose up -d --build
```

Full step-by-step: see [deploy/DEPLOYMENT_STEPS.md](deploy/DEPLOYMENT_STEPS.md).

### Nginx Reverse Proxy + HTTPS

Use Nginx to proxy API routes and force HTTPS. Example layout:

```
server {
	listen 80;
	server_name your-domain.com;
	return 301 https://$host$request_uri;
}

server {
	listen 443 ssl;
	server_name your-domain.com;

	ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

	gzip on;
	gzip_vary on;
	gzip_types text/plain text/css application/javascript application/json image/svg+xml;

	add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
	add_header X-Frame-Options "SAMEORIGIN" always;
	add_header X-Content-Type-Options "nosniff" always;
	add_header Referrer-Policy "strict-origin-when-cross-origin" always;

	location / {
		proxy_pass http://127.0.0.1:3000;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}
}
```

## Security Notes

- The current admin guard is frontend-only and should be backed by server-side authorization.
- JWT authentication and bcrypt hashing are enforced in the API server.
- Set `CORS_ORIGINS` to your production domain to restrict access.
- Keep `JWT_SECRET` private and rotate if needed.

## Project Structure

- `src/components` - reusable UI, layout, and feature components
- `src/pages` - customer and admin pages
- `src/services` - API layer for Express
- `src/store` - Zustand stores
- `server/db.json` - JSON data source (seed)
- `server/apiServer.js` - Express API with JWT and uploads

## Notes

- Admin login (demo): admin@waslartisan.com / admin123
- Admin product images are stored in [public/uploads](public/uploads) when uploaded via the API.
- Image placeholders live in [public/images](public/images) and should be replaced with licensed artisan photography.
- Checkout captures full address, city, and delivery notes in each order record.

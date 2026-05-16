# WaslArtisan

WaslArtisan is a premium handcrafted ecommerce experience inspired by Moroccan artisan culture and a calm, minimal aesthetic. It includes a full customer storefront and an admin dashboard powered by JSON Server.

## Tech Stack

- React (Vite)
- React Router
- Zustand (state)
- Tailwind CSS
- Framer Motion
- Axios
- JSON Server

## Getting Started

Install dependencies:

```
npm install
```

Run JSON Server (fake database):

```
npm run server
```

Run the frontend:

```
npm run dev
```

Run both together:

```
npm run dev:all
```

## Project Structure

- `src/components` - reusable UI, layout, and feature components
- `src/pages` - customer and admin pages
- `src/services` - API layer for JSON Server
- `src/store` - Zustand stores
- `server/db.json` - mock data source

## Notes

- Admin login (demo): admin@waslartisan.com / admin123
- Admin product images are uploaded via file input and stored as base64 in JSON Server.
- Product images in the seed data are local SVG placeholders and should be replaced with licensed assets.
- Checkout captures full address, city, and delivery notes in each order record.

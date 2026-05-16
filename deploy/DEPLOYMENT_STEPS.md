# WaslArtisan Deployment (Docker + DigitalOcean)

## Prerequisites

- DNS A records pointing to the droplet IP:
  - waslartisan.com -> 138.68.168.9
  - www.waslartisan.com -> 138.68.168.9
- Docker and Docker Compose installed on the server.

## 1) SSH and prepare

```
ssh root@138.68.168.9
```

Install Docker and Compose (Ubuntu example):

```
apt update
apt install -y docker.io docker-compose
systemctl enable --now docker
```

## 2) Clone the project

```
git clone <your-repo-url> /var/www/waslartisan
cd /var/www/waslartisan
```

## 3) Configure environment

Create `.env` in the project root using [deploy/docker.env.example](deploy/docker.env.example).
Set a strong `JWT_SECRET`.

## 4) Build and run containers

```
docker-compose up -d --build
```

## 5) Configure Nginx on the host

Install Nginx:

```
apt install -y nginx
```

Copy [deploy/nginx-waslartisan.conf](deploy/nginx-waslartisan.conf) to `/etc/nginx/sites-available/waslartisan` and enable it:

```
ln -s /etc/nginx/sites-available/waslartisan /etc/nginx/sites-enabled/waslartisan
nginx -t
systemctl reload nginx
```

## 6) SSL with Certbot

```
apt install -y certbot python3-certbot-nginx
certbot --nginx -d waslartisan.com -d www.waslartisan.com
```

## 7) Verify

- https://waslartisan.com loads the frontend.
- https://waslartisan.com/api/health returns `{ "status": "ok" }`.
- Admin login works and product CRUD functions.
- Uploads save to `/uploads` and render on product cards.

## Notes

- Backend data persists in the `db-data` Docker volume.
- Uploaded images persist in the `uploads-data` Docker volume.
- HTTP is redirected to HTTPS by Nginx.

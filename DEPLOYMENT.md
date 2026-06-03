# Deployment Guide — B2B Marketplace Portal

This guide covers deploying the backend and frontend to production.

---

## Architecture Overview

```
[Users] → [CDN/Static Host (Frontend)] → [API Server (Backend)] → [MongoDB Atlas]
                                              ↓
                                        [Cloudinary]
                                              ↓
                                        [SMTP Email]
```

---

## 1. MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write permissions
3. Whitelist your server IP (or `0.0.0.0/0` for cloud platforms)
4. Copy the connection string:
   ```
   mongodb+srv://<user>:<password>@cluster.mongodb.net/b2b_marketplace
   ```

---

## 2. Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Copy **Cloud Name**, **API Key**, and **API Secret** from the dashboard
3. Add to backend `.env`

---

## 3. Backend Deployment (Render / Railway / VPS)

### Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-random-secret-min-32-chars>
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=...
SMTP_PASSWORD=...
FROM_NAME=B2B Marketplace Portal
FROM_EMAIL=noreply@yourdomain.com
CLIENT_URL=https://your-frontend-domain.com
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<secure-password>
```

### Deploy on Render

1. Connect GitHub repo
2. Set **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. Add all environment variables
6. After deploy, run seed once via Render Shell:
   ```bash
   npm run seed
   ```

### Deploy on VPS (Ubuntu)

```bash
# Install Node.js 20 & PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

# Clone & setup
git clone <your-repo> /var/www/b2b-marketplace
cd /var/www/b2b-marketplace/backend
cp .env.example .env
nano .env   # fill in production values
npm install --production
npm run seed
pm2 start src/server.js --name b2b-api
pm2 save
pm2 startup
```

### Nginx Reverse Proxy (VPS)

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable SSL with Certbot:
```bash
sudo certbot --nginx -d api.yourdomain.com
```

---

## 4. Frontend Deployment (Vercel / Netlify)

### Environment Variables

```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Deploy on Vercel

1. Import GitHub repo
2. Set **Root Directory**: `frontend`
3. **Framework Preset**: Vite
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. Add `VITE_API_URL` environment variable

### Deploy on Netlify

```toml
# netlify.toml (place in frontend/)
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 5. Post-Deployment Checklist

- [ ] Change default admin password immediately
- [ ] Set strong `JWT_SECRET` (use `openssl rand -base64 32`)
- [ ] Configure CORS `CLIENT_URL` to match frontend domain
- [ ] Enable MongoDB Atlas IP whitelist for production server
- [ ] Test email flows (registration, forgot password)
- [ ] Test image uploads via Cloudinary
- [ ] Run seed script for initial categories & CMS pages
- [ ] Set up SSL on both frontend and backend domains
- [ ] Configure rate limiting thresholds for production traffic
- [ ] Set up monitoring (PM2 logs, Render metrics, or Datadog)

---

## 6. Docker Deployment (Optional)

### Backend Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

### Frontend Dockerfile

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  api:
    build: ./backend
    ports:
      - "5000:5000"
    env_file: ./backend/.env
    depends_on:
      - mongo

  web:
    build:
      context: ./frontend
      args:
        VITE_API_URL: http://localhost:5000/api
    ports:
      - "80:80"
    depends_on:
      - api

  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongo_data:
```

Run:
```bash
docker-compose up -d
docker-compose exec api npm run seed
```

---

## 7. Security Best Practices

1. Never commit `.env` files
2. Use HTTPS everywhere in production
3. Rotate JWT secrets periodically
4. Enable MongoDB authentication
5. Use App Passwords for Gmail SMTP (not account password)
6. Set `httpOnly` + `secure` cookies (already configured for production)
7. Review and adjust rate limits based on traffic
8. Regular dependency updates: `npm audit fix`

---

## 8. Scaling Considerations

| Component | Scaling Strategy |
|-----------|-----------------|
| API | Horizontal scaling with load balancer + PM2 cluster |
| MongoDB | Atlas M10+ with replica sets |
| Images | Cloudinary CDN (automatic) |
| Frontend | Static CDN (Vercel/Netlify edge) |
| Real-time Chat | Add Socket.io server with Redis adapter |

---

## Support

For issues, check:
- Backend health: `GET /api/health`
- MongoDB connection logs
- Browser network tab for API errors

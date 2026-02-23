# 1. Bağımlılıkları Kurma Aşaması (Deps)
FROM node:22.15.0-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# 2. Derleme Aşaması (Builder)
FROM node:22.15.0-alpine AS builder
WORKDIR /app

# Çift slash hatası düzeltildi ve doğru yoldan kopyalandı
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# 3. Çalıştırma Aşaması (Runner)
FROM node:22.15.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Güvenlik için kullanıcı oluşturma
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Dosyaları builder'dan alırken direkt doğru yetkilerle kopyalıyoruz (--chown)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Gereksiz "RUN mkdir .next" kaldırıldı

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "run", "start"]
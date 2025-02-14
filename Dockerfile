FROM node:latest AS builder
WORKDIR /app
COPY . .
RUN yarn
RUN yarn add typescript
RUN yarn build


FROM node:alpine AS production
WORKDIR /app
# COPY .env .env
COPY --from=builder /app/package.json .
COPY --from=builder /app/build .
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3333
CMD ["yarn", "start"]
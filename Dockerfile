FROM mhart/alpine-node:10

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --prod

# Only copy over the node pieces we need from the above image
FROM mhart/alpine-node:slim-10

WORKDIR /app

COPY --from=0 /app .

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
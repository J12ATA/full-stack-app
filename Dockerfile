FROM node:10

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

EXPOSE 3000 5000

CMD ["npm", "run", "dev"]
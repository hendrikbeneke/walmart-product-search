FROM node:10.11.0-jessie

RUN apt-get update

RUN mkdir -p /app
WORKDIR /app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app

EXPOSE 3001

CMD ["npm", "start"]

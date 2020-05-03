FROM node:12-alpine

RUN apk add git make gcc g++ python

WORKDIR /app

COPY ./package.json /app
COPY ./yarn.lock /app
RUN yarn

COPY . /app

RUN yarn build

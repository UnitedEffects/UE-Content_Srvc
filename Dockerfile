# Project Freedom
# UE Postcard Content IMAGE
# Copyright 2018

FROM mhart/alpine-node:9
LABEL owner="bmotlagh@unitedeffects.com"

RUN mkdir /app
COPY . /app
WORKDIR /app

RUN yarn --production

EXPOSE 3010

CMD ["yarn", "start"]

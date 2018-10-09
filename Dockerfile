# Project Freedom
# UE Postcard Content IMAGE
# Copyright 2018

FROM mhart/alpine-node:9
LABEL owner="bmotlagh@unitedeffects.com"

RUN mkdir /app
COPY . /app
WORKDIR /app

RUN mv /app/src/config_changeme.js /app/src/config.js
RUN yarn --production

EXPOSE 3010

CMD ["yarn", "start"]

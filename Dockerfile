# Project Freedom
# UE Postcard Content IMAGE
# Copyright 2018

FROM mhart/alpine-node:9
LABEL owner="bmotlagh@unitedeffects.com"

RUN mkdir /src
COPY . /src
WORKDIR /src

RUN mv /src/config-changeme.js /src/config.js
RUN yarn

EXPOSE 3010

CMD ["yarn", "start"]

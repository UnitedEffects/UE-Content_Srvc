# Project Freedom
# UE Postcard Content IMAGE
# Copyright 2017

FROM mhart/alpine-node
LABEL author="borzou@theboeffect.com"
RUN apk update
RUN apk add git
RUN mkdir /src

COPY . /src
WORKDIR /src
RUN npm install bower -g
RUN npm install
RUN bower install --allow-root

EXPOSE 3010

CMD ["node", "./bin/www"]

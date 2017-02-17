# Project Freedom
# UE Postcard Content IMAGE
# Copyright 2017

FROM mhart/alpine-node
LABEL author="borzou@theboeffect.com"

RUN mkdir /src

COPY . /src
WORKDIR /src
RUN npm install

EXPOSE 3001

CMD ["node", "./bin/www"]
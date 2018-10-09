# UE-Content_Srvc
This service allows you to create and store content (text, html or images) to be utilized on web pages. Images are sent to an S3 bucket of your choosing. The service is designed to run as a wrapped lambda function in aws with a gateway proxying requests.

## Dependencies

* node
* yarn
* npm
* aws account
* serverless configured

## Running Source Locally

This will run directly from the source code. It uses babelcore in memory so you don't need to transpile anything.

* Clone this repo
* mv /src/config_changeme.js /src/config.js
* Update default values in the config.js file
* yarn
* yarn test (pending)
* yarn run dev
* localhost:3010

## Transpile and Run

* Clone this repo
* mv /src/config_changeme.js /src/config.js
* Update default values in the config.js file
* yarn
* yarn test (pending)
* yarn build
* yarn run dist
* localhost:3010

## Setup Serverless

This serverless framework setup is only compatible with AWS Lambda because of the use of the serverless-http package.

* clone this repo
* mv /src/config_changeme.js /src/config.js
* update default values in the config.js file
* mv /.env_changem /.env
* Update /.env/env.test.json with appropriate values
* This repo uses the files within the .env folder to define for which environment to configure a deployment. The syntax for these environment files is env.{yourenvironment}.json, where "yourenvironment" represents a parameter that the serverless framework uses to identify the specific file it should be reading. In the provided example, "yourenvironment"=test. You can set this value using the environment variable SLS_ENV.
* SLS_ENV=test yarn run deploy

### Env Config

```
{
    "NAME": "ue-content-srvc", // This is what your lambda function, gateway, and cloudfront deployments will be named
    "NODE_ENV": "qa", // This is your environment and AWS differentiates deployments using this value
    "SWAGGER": "example.com", // Your custom domain to map the deployment
    "MONGO": "mongodb://example:27017/ue-content", // Your DB. This code assumes that NODE_ENV=production means you have a replica set. If not, don't use "production"
    "REPLICA": "rs0", // Your replica set identifier
    "UEAUTH": "https://domainqa.unitedeffects.com", // This code is based on the UE Auth IDM system. But you could swap this out. See below "AUTH"
    "PRODUCT_SLUG": "your_product_name", // A product identifier. Optional
    "S3_KEY": "YOURS3KEY",
    "S3_SECRET": "YOURS3SECRET",
    "S3_BUCKET": "YOURBUCKET"
}
```

## Docker

You can package this into a container. The docker file is provided.

## Live

https://contentqa.unitedeffects.com

## Documentation

https://contentqa.unitedeffects.com/api

### UEAUTH IDM

This code base uses a proprietary OAuth2 based IDM system called [UEAuth](ueauth.io). It is represented as middleware on the routes and you can swap it out if you like. see src/routes

### Gateway

This service uploads images as image/* and multipart/form-data mimetypes. AWS Gateway does not directly support these mimetypes. As a result, it is required that you configure the gateway to convert these to binary. This configuration is provided in the serverless.yaml file

### Entrypoint

When running this service locally or in a container, you would use the "yarn start" or "yarn run dev" commands. These commands use the /bin/start.js file as an entrypoint. Start.js configures the mongodb connection and actually initiates the http server to listen to incoming request. When wrapping your application into an event bases lambda function, you don't want to start the server. Instead, the entry point configured for serverless is the bin/slsapp.js file, which wraps app in the serverless-http package and makes it available to the lambda function. This file does everything start does but without actually starting the node server.

### Serverless Commands You Should Know

* sls package <-- creates the serverless package under ./.serverless but does not deploy. Useful when testing the SLS_ENV configuration
* SLS_ENV=qa sls package <-- an exampel of the above test. Assumes you have a file called ./.env/env.qa.json
* sls deploy <-- creates the package and deploys all of your configuration
* sls create_domain <-- If you are setting up a custom domain for the first time, you may need to do this before you deploy
* sls remove <-- Removes the entire build: gateway and function
* SLS_ENV=qa sls remove <-- Removes the build components associated specifically to your qa environment

## MIT License

Copyright (c) 2018 theBoEffect LLC (DBA United Effects)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

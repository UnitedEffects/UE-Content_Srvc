# UE-Content_Srvc
This service allows you to create and store content (text or html) to be utilized on web pages.

## Documentation

https://github.com/UnitedEffects/UE-Content_Srvc/wiki/Documentation

## Docker

* docker pull unitedeffects/ue-content:latest
* docker run -p 3010:3010 -e MONGO=mongodb://localhost:27017/ue-content -e SWAG_DOM=localhost:3010 -e unitedeffects/ue-content:latest

API documentation at http://localhost:3010

## Local

* clone this repo
* npm install
* npm start

API documentation at http://localhost:3010


## MIT License

Copyright (c) 2017 theBoEffect LLC

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

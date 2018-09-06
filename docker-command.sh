#!/bin/sh

npm install
if [ ! -z "$ENV" ] && [ "$ENV" == "dev" ];then
    npm run develop
else
    npm start
fi
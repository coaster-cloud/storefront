#!/bin/bash

ENVIRONMENT=$1

if [ $ENVIRONMENT == 'production' ]
then
  npm install
  npm run build
fi

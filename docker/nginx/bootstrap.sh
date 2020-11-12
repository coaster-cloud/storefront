#!/bin/bash

ENVIRONMENT=$1

if [[ $ENVIRONMENT == 'production' ]]
then
  echo "Bootstrap application for production ..."
  npm install
  npm run build
fi

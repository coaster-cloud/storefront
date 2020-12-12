FROM node:15.4

RUN apt-get update \
  && apt-get install -y curl build-essential

RUN npm install -g node-gyp

WORKDIR /var/www/html
COPY ./ ./

RUN npm install && npm run build

EXPOSE 8020

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=8020

CMD npm run start

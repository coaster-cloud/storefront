FROM nginx:1.19.3
ARG bootstrap=development

RUN apt-get update \
  && apt-get install -y curl build-essential \
  && curl -sL https://deb.nodesource.com/setup_15.x | bash - \
  && apt-get install -y nodejs \
  && curl -L https://www.npmjs.com/install.sh | sh

RUN npm install -g node-gyp

WORKDIR /var/www/html

COPY ./ ./
COPY ./docker/nginx/server.conf /etc/nginx/conf.d/server.conf

RUN ./docker/nginx/bootstrap.sh "$bootstrap"

EXPOSE 8020

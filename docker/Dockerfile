FROM nginx:1.19.3 as base

RUN apt-get update \
  && apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_15.x | bash - \
  && apt-get install -y nodejs \
  && curl -L https://www.npmjs.com/install.sh | sh \
  && apt-get install -y build-essential

RUN npm install -g node-gyp

WORKDIR /var/www/html

FROM base as development

FROM base as production
COPY ./ ./
COPY ./docker/nginx.conf /etc/nginx/conf.d/app.conf
RUN npm install && npm run build

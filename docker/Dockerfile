FROM nginx:1.19.3

RUN apt-get update \
  && apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_15.x | bash - \
  && apt-get install -y nodejs \
  && curl -L https://www.npmjs.com/install.sh | sh

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/www/html

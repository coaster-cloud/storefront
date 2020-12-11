FROM node:15.4-alpine

WORKDIR /var/www/html
COPY ./ ./
RUN npm install
RUN npm run build

EXPOSE 8020

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=8020

CMD [ "npm", "start" ]

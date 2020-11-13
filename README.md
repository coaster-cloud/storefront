# coaster.cloud Web App
This is the VueJS client application from [coaster.cloud](https://coaster.cloud).

**This project is not meant for re-use.** It is open source to make it easy to contribute. We provide no support if you
want to run your own, and will do breaking changes without notice.

## Work in Progress
coaster.cloud is already a single page application (SPA) but still shares some interfaces with a legacy PHP backend
application. These interfaces have to be solved before this repository can be filled completely and taken live.
Therefore, this repository is still "incomplete". These tasks have to be done in the legacy PHP app before
we can continue with this WebApp:

- [ ] Replace all legacy RESTful Endpoints with new GraphQL API
- [ ] Move all translations from API to Single Page Application
- [x] Move Media Service to own Microservice

## Installation
You only need [docker-compose](https://docs.docker.com/compose/) to install this application. The app container
contains all dependencies for building and serving the application. The installation can take a few minutes.

1. Clone this repository
2. Create and start container with `docker-compose up -d --build`
3. Install dependencies `docker-compose exec nginx npm install`
4. Build javascript and css with `docker-compose exec nginx npm run build`

After that your local application will be accessible via `http://localhost`. You should see a "HELLO COASTER WORLD!" 
message.

Run `docker-compose stop` to stop and `docker-compose start` to start the application. 

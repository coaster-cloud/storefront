# coaster.cloud Storefront
This is the VueJS client application from [coaster.cloud](https://coaster.cloud).

**This project is not meant for re-use.** It is open source to make it easy to contribute. We provide no support if you
want to run your own, and will do breaking changes without notice.

## Installation
You only need [docker-compose](https://docs.docker.com/compose/) to install this application. The app container
contains all dependencies for building and serving the application.

1. Clone this repository
2. Create and start container with `docker-compose up -d --build`
3. Install dependencies `docker-compose exec app npm install`
4. Build javascript and css with `docker-compose exec app npm run build`

After that your local application will be accessible via `http://localhost`. You should see a "HELLO COASTER WORLD!" 
message.

Run `docker-compose stop` to stop and `docker-compose start` to start the application. 

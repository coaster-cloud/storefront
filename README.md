# coaster.cloud Web App
This is the VueJS / NuxtJS client application for [coaster.cloud](https://coaster.cloud).

**This project is not meant for re-use.** It is open source to make it easy to contribute. We provide no support if you
want to run your own, and will do breaking changes without notice.

## Local development
[NodeJS](https://nodejs.org/en/) is the only requirement you need locally to set up the project.

Simply run the following tasks:

* Copy `.env.dist` to `.env` and add credentials
* Install dependencies with `npm install`
* Compile and start server with `npm run dev`

The app is then accessible via http://localhost:3000.

Hot reload is active. Changes become directly visible after a few seconds.

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Production development
The project will later run with Docker. To test the app in production mode you need to ...

* ... install [Docker](https://www.docker.com) and [Docker Compose](https://docs.docker.com/compose/install/)
* ... build and start container with `docker-compose up -d --build`

The app is then accessible via http://localhost:8020.

## License

* The source code licensed under [MIT](./LICENSE)
* All fonts under `./assets/fonts` licensed under [Open Font License](https://fonts.google.com/specimen/Nunito#license)
* All images under `./assets/images` and `./static` are proprietary. Using the images outside of this project is not permitted.

## Install Dependencies

```
npm i
```

## Run in local environtment

```
npm run dev
```

## Build instructions

```
npm run build
```

You will see some nice output thanks to `next-progressbar` package used in `next.config.js`.

## Build Docker image

Files into play: `.dockerignore` and `Dockerfile` in the root of the project.
Just run the following command:

```
docker build -t docker-nextjs .
```

Then, can be run from a terminal with:

```
 docker run -d -p 3333:3000 docker-nextjs:latest
```

and then would be accessible in `localhost:3333` for example, given that the container exposes port `3000`.

## License

Copyright 2018 Bellini & Lobo

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

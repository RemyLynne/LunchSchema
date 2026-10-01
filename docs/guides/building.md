<!--TODO: justfile-->

# Building

Building of the application is done in two steps, frontend then backend

This order is explicit, as the backend will automatically pull the frontend's build files, as to host it in production

Just command: `just build`

## Build frontend

Just command: `just build-frontend`

manual:
```bash
cd WebContent
pnpm install --frozen-lockfile
pnpm build
```

## Build backend

Just command: `just build-backend`

manual:

```bash
./gradlew bootjar
```

The executable jar file should now be available in `./build/libs/`, and can be started with java (`java -jar <jarfile>`)
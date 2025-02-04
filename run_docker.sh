# build docker image
docker build -t tg-login .

# run container, integrated
docker run --rm -it \
    -v ./.env:/app/.env \
    tg-login bun start
# build docker image
docker build -t tg-login .

# read .env variables
export $(cat .env | xargs)

# run container, integrated
docker run --rm -it \
    -e TELEGRAM_API_ID=${TELEGRAM_API_ID} \
    -e TELEGRAM_API_HASH=${TELEGRAM_API_HASH} \
    -e TELEGRAM_APP_VERSION=${TELEGRAM_APP_VERSION} \
    -e TELEGRAM_DEVICE_MODEL=${TELEGRAM_DEVICE_MODEL} \
    -e TELEGRAM_SYSTEM_VERSION=${TELEGRAM_SYSTEM_VERSION} \
    tg-login bun start
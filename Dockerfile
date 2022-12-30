FROM node:lts-alpine

LABEL MAINTAINER likun7981

ENV DOCKER=true \
    PS1="\u@\h:\w \$ " \
    PUID=1000 \
    PGID=1000 \
    UMASK=022

RUN apk add --no-cache \
        bash \
        su-exec \
    && \
    npm i -g hlink

COPY --chmod=755 entrypoint.sh /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

EXPOSE 9090

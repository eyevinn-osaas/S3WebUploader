#!/bin/bash

sed -i "s/listen\s*8080;/listen $PORT;/" /etc/nginx/conf.d/default.conf

NODE_OPTIONS=--openssl-legacy-provider yarn build && \
  cp -r /app/dist/* /usr/share/nginx/html/ && \
  nginx -g 'daemon off;'
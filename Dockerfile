FROM nginx:1.19.0
ARG PORT=8080
EXPOSE $PORT

RUN apt-get update
RUN apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_21.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g yarn
RUN mkdir /app
WORKDIR /app

COPY . .
RUN yarn --immutable

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
RUN chmod +x /app/scripts/entrypoint.sh

ENV NODE_ENV production
ENTRYPOINT [ "/app/scripts/entrypoint.sh" ]
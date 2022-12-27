FROM node:16-slim

WORKDIR /usr/src/app

COPY . .

RUN yarn install --immutable

EXPOSE 80

CMD ["yarn", "start"]
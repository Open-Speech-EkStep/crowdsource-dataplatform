FROM node:12

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y gcc-multilib g++-multilib
RUN apt-get install -y libpq-dev
RUN apt-get install -y libsndfile1

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

ARG NODE_CONFIG_ENV=default

ENV NODE_CONFIG_ENV=${NODE_CONFIG_ENV}
ENV NODE_ENV=production

CMD [ "npm", "start" ]
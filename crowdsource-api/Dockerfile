FROM node:12

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y ffmpeg
RUN apt-get install -y sox
RUN apt-get install -y gcc-multilib g++-multilib
RUN apt-get install -y libpq-dev
RUN apt-get install -y libsndfile1

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

RUN mkdir -p /opt/binaries/
COPY binaries/wada_snr.tar.gz .
RUN tar -xzvf wada_snr.tar.gz
RUN mv WadaSNR /opt/binaries/
RUN rm wada_snr.tar.gz
RUN ls /opt/binaries/WadaSNR/

ARG NODE_CONFIG_ENV=default

ENV NODE_CONFIG_ENV=${NODE_CONFIG_ENV}
ENV NODE_ENV=production
EXPOSE 8080

CMD [ "node", "src/server.js","azure" ]
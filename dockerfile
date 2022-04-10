FROM node:16.11.0
# create destination directory
RUN mkdir -p /usr/src/dapp.polarnodes
WORKDIR /usr/src/dapp.polarnodes

RUN apt-get update && apt-get install git

# copy the app, note .dockerignore
COPY . /usr/src/dapp.polarnodes/

# RUN npm install --save-dev webpack

RUN npm install @types/mocha
# build necessary, even if no static files are needed,
# since it builds the server as well
RUN sh -c "IS_TESTNET=true npm run build"

# expose 5000 on container
EXPOSE 7500

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=7500

# start the app
CMD [ "npm", "start" ]
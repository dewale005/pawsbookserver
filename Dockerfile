FROM node:latest
LABEL Pawsbook app

COPY . /src

WORKDIR /src

RUN npm install --production

EXPOSE 3000

CMD npm run dev
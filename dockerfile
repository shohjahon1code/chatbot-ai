FROM node:20-alpine

WORKDIR /usr/src/apps

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3110

CMD ["npm", "start"]

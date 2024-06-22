FROM node:latest

WORKDIR /app

RUN npm install -g @angular/cli

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN ng build

EXPOSE 3000

CMD ["node","index.js"]
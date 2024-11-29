FROM node:18

WORKDIR /app

COPY . /app

RUN npm install

ENTRYPOINT ["npm", "run", "dev", "--", "--host"]
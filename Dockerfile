# pull official base image
FROM node:16.14.0-alpine

# set working directory
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm run build 

# add app
COPY . ./

# start app
CMD ["npm", "start"]
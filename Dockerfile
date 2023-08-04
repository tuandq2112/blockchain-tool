# Use an official Node.js runtime as the base image
FROM node:16.14.0-alpine

# Set the working directory within the container
WORKDIR /app

# Copy the rest of the application code to the working directory
COPY . .

RUN npm i 

RUN npm run build --prod

# Expose the port that the application will run on
EXPOSE 3000

# Start the application when the container starts
CMD ["npm", "start"]

# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install -g @nestjs/cli

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build

# Command to start the application
CMD ["npm", "run", "start:prod"]
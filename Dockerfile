# Use the official Node.js 16 Alpine image as a base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install project dependencies using Yarn
RUN yarn install

# Copy the source code to the working directory
COPY . .

COPY OntarioLeaseAgreement.pdf /app/OntarioLeaseAgreement.pdf

# Build the TypeScript code

# Expose the port your Express server is running on
EXPOSE 3000

# Start the Express server
CMD [ "yarn", "start" ]

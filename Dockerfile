# Use the official Node.js image
FROM node:18

# Create and change to the app directory
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run the web service on container startup.
CMD ["node", "server.js"]

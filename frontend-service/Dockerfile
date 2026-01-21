# Use Node alpine for a small footprint
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the dev server
CMD ["npm", "run", "dev"]
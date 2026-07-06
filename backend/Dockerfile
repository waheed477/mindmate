FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
# FIXED: Expose port 5000 for the backend API
EXPOSE 5000

# Start the application
# FIXED: Use the correct entry point path
CMD ["node", "dist/server/index.js"]
# Simple Dockerfile for the React frontend
# - Runs the development server (react-scripts start)
# - Exposes port 3000
# - Copies the local .env into the image

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies using npm (package-lock.json is present)
COPY package*.json ./
RUN npm ci

# Copy app source (includes .env)
COPY . .

# Ensure the dev server binds to all interfaces inside the container
ENV HOST=0.0.0.0

# Expose CRA dev server port
EXPOSE 3000

# Start the dev server
CMD ["npm", "start"]


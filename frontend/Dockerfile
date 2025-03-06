# Frontend Dockerfile

# Node.js image
FROM node:16

# Work directory
WORKDIR /app

# Copy dependencies files
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

# Copy app code
COPY . /app/

COPY .env.development /app/

# Build React app
RUN npm run build

# Expose port
EXPOSE 3000

# Execute app
CMD ["npm", "start"]
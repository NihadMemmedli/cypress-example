FROM cypress/included:14.3.2

# Set working directory
WORKDIR /e2e

# Set NODE_ENV to development
ENV NODE_ENV=development

# Copy package manifests first to leverage caching
COPY package.json package-lock.json ./

# Install node dependencies
RUN npm ci

# Copy rest of the project
COPY . .

# Default command: run Cypress tests
CMD ["npm", "run", "cy:run"] 
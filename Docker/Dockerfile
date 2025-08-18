# Use nginx as the base image for serving static files
# Using latest version of nginx alpine. Best practice will be to use a specific version
FROM nginx:alpine

# Copy all application files to nginx html directory (from parent directory)
COPY ../ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start nginx (default CMD from nginx:alpine image)
CMD ["nginx", "-g", "daemon off;"]

# Use nginx as the base image for serving static files
FROM nginx:alpine

# Copy all application files to nginx html directory (from parent directory)
COPY ../ /usr/share/nginx/html/

# Remove any unnecessary files from the container
RUN rm -rf /usr/share/nginx/html/Docker /usr/share/nginx/html/README.md

# Expose port 80
EXPOSE 80

# Start nginx (default CMD from nginx:alpine image)
CMD ["nginx", "-g", "daemon off;"]

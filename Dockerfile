# Use the official Nginx image
FROM nginx:alpine

# Copy your static files to the Nginx HTML directory
COPY front.html /usr/share/nginx/html/front.html
COPY script.js /usr/share/nginx/html/script.js
COPY style.css /usr/share/nginx/html/style.css

# Create .htpasswd for basic auth
RUN apk add --no-cache apache2-utils && \
    htpasswd -cb /etc/nginx/.htpasswd flamagil flamagil

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

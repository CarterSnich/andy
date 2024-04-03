# Use the official PHP image as the base image
FROM php:8.2-fpm

# Set the working directory inside the container
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip

# PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy the composer.json and composer.lock files to install dependencies
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-plugins --no-scripts

# Copy the rest of the application code
COPY . .

# Expose the port on which Laravel serves the application
EXPOSE 8000

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
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
RUN php composer-setup.php
RUN php -r "unlink('composer-setup.php');"
RUN mv composer.phar /usr/local/bin/composer

# Copy the composer.json and composer.lock files to install dependencies
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-plugins --no-scripts

# Copy the rest of the application code
COPY . .

# Expose the port on which Laravel serves the application
EXPOSE 8000

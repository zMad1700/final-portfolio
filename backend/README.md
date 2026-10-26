# Portfolio API

Laravel 12 API scaffold for the portfolio. PostgreSQL is configured as the default database connection.

## Local setup

1. Install PHP dependencies with `composer install`.
2. Create a PostgreSQL database named `portfolio` and set your credentials in `.env`.
3. Enable PHP's `pdo_pgsql` extension in your PHP installation.
4. Run `php artisan key:generate` and `php artisan migrate`.
5. Start the API with `php artisan serve`.

The health endpoint is available at `http://127.0.0.1:8000/api/health`.

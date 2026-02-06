# Diafat PHP Backend Setup

This backend is a professional MVC implementation using PHP and MySQL.

## Prerequisites
1.  **XAMPP** (or any PHP + MySQL Stack)
    -   Download XAMPP: [https://www.apachefriends.org/download.html](https://www.apachefriends.org/download.html)
    -   Install it (Default location `C:\xampp` is fine).
2.  **Composer** (PHP Package Manager)
    -   Download Setup: [https://getcomposer.org/Composer-Setup.exe](https://getcomposer.org/Composer-Setup.exe)
    -   During install, point it to your `php.exe` (usually `C:\xampp\php\php.exe`).

## Installation Steps

1.  **Database Setup**:
    -   Open XAMPP Control Panel and Start **Apache** and **MySQL**.
    -   Go to [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
    -   Create a new database named `diafat_db`.
    -   Import the schema:
        -   Click **Import**.
        -   Choose file: `php-server/database/schema.sql`.
        -   Click **Go**.

2.  **Install Dependencies**:
    -   Open Terminal in `php-server` folder.
    -   Run: `composer install`

3.  **Run the Server**:
    -   In Terminal: `php -S localhost:8000 -t public`
    -   Your API is now running at `http://localhost:8000/api`.

## Configuration
-   Edit `.env` (copy from `.env.example`) to change database credentials if needed.

## Architecture
-   **src/Controllers**: Handles API requests (Hotels, Auth, Bookings).
-   **src/Models**: Interacts with Database.
-   **src/Config**: Database connection settings.
-   **public/index.php**: Main entry point.

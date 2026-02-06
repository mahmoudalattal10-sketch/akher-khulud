@echo off
echo Starting Diafat Application...

echo Starting Backend (PHP) on port 3001...
start /B C:\xampp\php\php.exe -S localhost:3001 -t php-server/public

echo Starting Frontend (Vite) on port 3000...
start cmd /k "npm run dev"

echo Done! Access the site at http://localhost:3000
pause

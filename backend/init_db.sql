-- Crear usuario para la aplicación --
CREATE USER hallowed_user WITH PASSWORD 'CONTRASEÑA';

-- Crear la base de datos --
CREATE DATABASE hallowed_library_db OWNER hallowed_user;

-- Dar todos los privilegios al usuario --
GRANT ALL PRIVILEGES ON DATABASE hallowed_library_db TO hallowed_user;

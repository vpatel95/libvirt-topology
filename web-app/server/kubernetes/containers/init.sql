-- Create the 'apidb' database (if not already created)
CREATE DATABASE IF NOT EXISTS apidb;

-- Create a new user 'apiuser' with password and grant privileges on 'apidb'
CREATE USER IF NOT EXISTS 'apiuser'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';
GRANT ALL PRIVILEGES ON apidb.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;

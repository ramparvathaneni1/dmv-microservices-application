CREATE DATABASE vehicle;
CREATE DATABASE driver;
CREATE DATABASE plate;

CREATE SCHEMA IF NOT EXISTS vehicle;
CREATE SCHEMA IF NOT EXISTS driver;
CREATE SCHEMA IF NOT EXISTS plate;

CREATE USER dbu@localhost IDENTIFIED BY 'aPassword';
GRANT ALL ON vehicle.* TO dbu@localhost;
GRANT ALL ON driver.* TO dbu@localhost;
GRANT ALL ON plate.* TO dbu@localhost;
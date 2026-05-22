-- DOWN MIGRATION

-- 1. Remover primeiro as tabelas que dependem de outras
DROP TABLE IF EXISTS appointment_permissions;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS care_networks;

-- 2. Remover as tabelas base por último
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS users;

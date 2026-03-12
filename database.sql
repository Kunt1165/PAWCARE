-- PawCare Database Schema + Test Data
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS pawcare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pawcare;

-- ========================
-- TABLES
-- ========================

CREATE TABLE IF NOT EXISTS User (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Pet (
  pet_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  species ENUM('dog','cat','bird','rabbit','other') NOT NULL DEFAULT 'dog',
  breed VARCHAR(100),
  age DECIMAL(4,1),
  photo VARCHAR(500),
  allergies TEXT,
  microchip BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS MedicalRecord (
  record_id INT PRIMARY KEY AUTO_INCREMENT,
  pet_id INT NOT NULL,
  date DATE NOT NULL,
  vaccine_name VARCHAR(200),
  description TEXT,
  vet_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id) REFERENCES Pet(pet_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Event (
  event_id INT PRIMARY KEY AUTO_INCREMENT,
  pet_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  time TIME,
  type ENUM('vaccination','checkup','medication','grooming','other') NOT NULL DEFAULT 'other',
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id) REFERENCES Pet(pet_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Reminder (
  reminder_id INT PRIMARY KEY AUTO_INCREMENT,
  pet_id INT NOT NULL,
  medicine_name VARCHAR(200) NOT NULL,
  dosage VARCHAR(100),
  date DATE NOT NULL,
  time TIME,
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id) REFERENCES Pet(pet_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS DiaryEntry (
  entry_id INT PRIMARY KEY AUTO_INCREMENT,
  pet_id INT NOT NULL,
  date DATE NOT NULL,
  note TEXT NOT NULL,
  symptoms TEXT,
  mood ENUM('great','good','ok','bad','sick') DEFAULT 'good',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id) REFERENCES Pet(pet_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS QR_Code (
  qr_id INT PRIMARY KEY AUTO_INCREMENT,
  pet_id INT UNIQUE NOT NULL,
  qr_data TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pet_id) REFERENCES Pet(pet_id) ON DELETE CASCADE
);

-- ========================
-- TEST DATA
-- ========================

-- Users (passwords are bcrypt of "password123")
INSERT INTO User (name, email, password, phone) VALUES
('Олена Даниленко', 'olena@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3q', '+380991234567'),
('Максим Кравченко', 'maxim@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3q', '+380671234567'),
('Аня Коваль', 'anya@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh3q', '+380501234567');

-- Pets
INSERT INTO Pet (user_id, name, species, breed, age, photo, allergies, microchip) VALUES
(1, 'Барсик', 'dog', 'Лабрадор', 3.5, NULL, 'Курятина', TRUE),
(1, 'Мурка', 'cat', 'Британська', 2.0, NULL, NULL, FALSE),
(2, 'Рекс', 'dog', 'Вівчарка', 5.0, NULL, NULL, TRUE),
(2, 'Кеша', 'bird', 'Хвилястий папуга', 1.0, NULL, NULL, FALSE),
(3, 'Сніжок', 'rabbit', 'Карликовий', 0.5, NULL, NULL, FALSE);

-- Medical Records
INSERT INTO MedicalRecord (pet_id, date, vaccine_name, description, vet_name) VALUES
(1, '2024-01-15', 'Rabies', 'Планова вакцинація від сказу. Реакція нормальна.', 'Лікар Петренко'),
(1, '2024-03-10', 'Комплексна DHPPiL', 'Комплексне щеплення. Стан здоровий.', 'Лікар Петренко'),
(1, '2024-08-20', NULL, 'Профілактичний огляд. Зуби в нормі, вага 32 кг.', 'Лікар Сидоренко'),
(2, '2024-02-01', 'Котяча чума', 'Вакцинація від панлейкопенії.', 'Лікар Петренко'),
(2, '2024-06-15', 'Сказ', 'Планова вакцинація. Без ускладнень.', 'Лікар Іванова'),
(3, '2023-12-01', 'Rabies', 'Вакцинація від сказу.', 'Лікар Мороз'),
(3, '2024-04-20', NULL, 'Річний огляд. Вага 35 кг.', 'Лікар Мороз');

-- Events
INSERT INTO Event (pet_id, title, date, time, type, notes, completed) VALUES
(1, 'Вакцинація від сказу', '2025-03-15', '14:00:00', 'vaccination', 'Клініка Добрі Лапи, вул. Шевченка 42', FALSE),
(1, 'Ветеринарний огляд', '2025-04-10', '10:00:00', 'checkup', 'Профілактичний', FALSE),
(1, 'Грумінг', '2025-03-20', '11:00:00', 'grooming', 'PetStyle, вул. Франка 17', FALSE),
(2, 'Планова вакцинація', '2025-03-25', '15:30:00', 'vaccination', NULL, FALSE),
(2, 'Стерилізація', '2025-05-01', '09:00:00', 'checkup', 'Запланована операція', FALSE),
(3, 'Ветеринарний огляд', '2025-03-18', '12:00:00', 'checkup', NULL, FALSE),
(1, 'Прийом вітамінів', '2025-02-01', '08:00:00', 'medication', 'Вітамін D3', TRUE),
(1, 'Оброблення від паразитів', '2025-01-15', '09:00:00', 'medication', NULL, TRUE);

-- Reminders
INSERT INTO Reminder (pet_id, medicine_name, dosage, date, time, notes, completed) VALUES
(1, 'Антигельмінтик Дронтал', '1 таблетка', '2025-03-10', '08:00:00', 'Давати з їжею', FALSE),
(1, 'Вітамін Е', '2 краплі', '2025-03-12', '09:00:00', NULL, FALSE),
(2, 'Капсули Омега-3', '1 капсула', '2025-03-11', '18:00:00', 'З вечірньою їжею', FALSE),
(3, 'Антигельмінтик', '2 таблетки', '2025-03-15', '08:00:00', NULL, FALSE),
(1, 'Краплі від бліх', '1 піпетка', '2025-02-15', '10:00:00', NULL, TRUE),
(2, 'Заспокійливе', '5 крапель', '2025-01-20', '20:00:00', 'Перед гучними подіями', TRUE);

-- Diary Entries
INSERT INTO DiaryEntry (pet_id, date, note, symptoms, mood) VALUES
(1, '2025-03-07', 'Барсик сьогодні був дуже активний! Грали у парку 2 години.', NULL, 'great'),
(1, '2025-03-05', 'Помітила, що Барсик погано їсть зранку.', 'Відмова від їжі вранці', 'ok'),
(1, '2025-03-03', 'Відмінна прогулянка. З'їв весь обід.', NULL, 'great'),
(2, '2025-03-06', 'Мурка багато спала. Це нормально для кішок.', NULL, 'good'),
(2, '2025-03-04', 'Грала з клубком нитки. Дуже весела!', NULL, 'great'),
(3, '2025-03-07', 'Рекс добре тренувався. Виконав всі команди.', NULL, 'great'),
(3, '2025-03-01', 'Помітив чхання. Можливо алергія на пилок.', 'Чхання', 'ok'),
(1, '2025-02-28', 'Барсик отримав нову іграшку. Щасливий!', NULL, 'great');

-- QR Codes
INSERT INTO QR_Code (pet_id, qr_data) VALUES
(1, '{"pet_id":1,"name":"Барсик","species":"dog","breed":"Лабрадор","owner":"Олена Даниленко","phone":"+380991234567","microchip":true,"allergies":"Курятина"}'),
(2, '{"pet_id":2,"name":"Мурка","species":"cat","breed":"Британська","owner":"Олена Даниленко","phone":"+380991234567","microchip":false,"allergies":null}'),
(3, '{"pet_id":3,"name":"Рекс","species":"dog","breed":"Вівчарка","owner":"Максим Кравченко","phone":"+380671234567","microchip":true,"allergies":null}');

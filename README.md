# 🐾 PawCare — Smart Pet Health Management

Повноцінний веб-додаток для управління здоров'ям домашніх тварин.

## Стек технологій

- **Frontend**: React 18, React Router, Axios, date-fns, react-hot-toast
- **Backend**: Node.js, Express.js, JWT, bcryptjs, QRCode
- **Database**: MySQL 8.0

## Швидкий старт

### 1. База даних MySQL

```bash
mysql -u root -p < database.sql
```

Або в MySQL Workbench / phpMyAdmin виконати файл `database.sql`.

### 2. Налаштування Backend

```bash
cd backend
cp .env.example .env
```

Відредагуй `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pawcare
JWT_SECRET=super_secret_key_change_me
```

```bash
npm install
npm run dev     # або npm start для продакшн
```

Сервер запуститься на **http://localhost:5000**

### 3. Запуск Frontend

```bash
cd frontend
npm install
npm start
```

Фронтенд на **http://localhost:3000**

## Тестові акаунти

| Email | Пароль | Ім'я |
|-------|--------|------|
| olena@example.com | password123 | Олена Даниленко (2 тварини) |
| maxim@example.com | password123 | Максим Кравченко (2 тварини) |
| anya@example.com | password123 | Аня Коваль (1 тварина) |

## Функціонал

### 🏠 Дашборд
- Статистика (кількість тварин, подій, нагадувань)
- Список улюбленців
- Найближчі події

### 🐾 Профілі тварин
- Додавання/редагування/видалення
- Вид, порода, вік, алергії, мікрочіп

### 💉 Медичні записи (на сторінці тварини)
- Журнал вакцинацій
- Записи ветеринарних оглядів
- Ім'я лікаря, дата, опис

### 📅 Календар
- Інтерактивний місячний вигляд
- Додавання подій: вакцинація, огляд, ліки, грумінг
- Позначення виконаних подій

### 🔔 Нагадування
- Ліки та процедури з дозуванням
- Фільтрація: майбутні / всі / виконані
- Позначення виконаних

### 📓 Щоденник
- Щоденні нотатки по кожній тварині
- Настрій (5 варіантів з емодзі)
- Запис симптомів

### 🔲 QR-код
- Генерація персонального QR для кожної тварини
- Містить: ім'я, породу, власника, телефон, мікрочіп, алергії
- Кнопка завантаження PNG

### 📰 Статті
- Фільтрація за категоріями

### 🗺️ Сервіси поряд
- Ветклініки, грумінг-салони, зоомагазини
- Контакти, години роботи, навігатор

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/pets
POST   /api/pets
PUT    /api/pets/:id
DELETE /api/pets/:id

GET    /api/medical/pet/:petId
POST   /api/medical
DELETE /api/medical/:id

GET    /api/events
GET    /api/events/pet/:petId
POST   /api/events
PATCH  /api/events/:id/complete
DELETE /api/events/:id

GET    /api/reminders
GET    /api/reminders/pet/:petId
POST   /api/reminders
PATCH  /api/reminders/:id/complete
DELETE /api/reminders/:id

GET    /api/diary/pet/:petId
POST   /api/diary
DELETE /api/diary/:id

GET    /api/qr/pet/:petId
```

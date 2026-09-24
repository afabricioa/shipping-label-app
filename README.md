# Shipping Label App

A full-stack prototype for generating and storing USPS shipping labels using the EasyPost API.

The application is composed of a Laravel REST API, a React frontend, and a MySQL database.

## Tech Stack

### Backend

* PHP 8.3+
* Laravel 13
* Laravel Sanctum
* MySQL 8.4
* EasyPost API

### Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* CSS

### Infrastructure

* Docker Compose
* MySQL

---

## Architecture

The application follows a simple client-server architecture:

All EasyPost API communication is handled by the backend. The EasyPost API key is never exposed to the frontend.

---

# Quick Start

## Prerequisites

Make sure the following are installed:

* PHP 8.3+
* Composer
* Node.js 18+
* npm
* Docker
* Docker Compose

An EasyPost API key is also required.

---

## 1. Clone the repository

```bash
git clone <repository-url>
cd shipping-turno-app
```

---

# Backend Setup

## 2. Start MySQL

From the project root:

```bash
docker compose up -d
```

This starts a MySQL 8.4 container with the following configuration:

```text
Database: shipping_app
Username: shipping_user
Password: shipping_password
Host: localhost
Port: 3306
```

You can verify that the container is running with:

```bash
docker compose ps
```

---

## 3. Configure the backend

Go to the backend directory:

```bash
cd backend
```

Install PHP dependencies:

```bash
composer install
```

Create the environment file:

```bash
cp .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

Update the `.env` file with the database configuration:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=shipping_app
DB_USERNAME=shipping_user
DB_PASSWORD=shipping_password
```

Configure EasyPost:

```env
EASYPOST_API_KEY=your_easypost_api_key
EASYPOST_BASE_URL=https://api.easypost.com/v2
```

The EasyPost API key must only exist in the backend environment.

---

## 4. Run database migrations

From the `backend` directory:

```bash
php artisan migrate
```

This creates the application tables, including:

* users
* personal_access_tokens
* shipping_labels

---

## 5. Start the Laravel API

```bash
php artisan serve
```

The API will be available at:

```text
http://localhost:8000
```

The API base URL is:

```text
http://localhost:8000/api
```

---

# Frontend Setup

## 6. Install frontend dependencies

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the frontend environment file:

```bash
cp .env.example .env
```

Configure the API URL:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at the URL shown by Vite, usually:

```text
http://localhost:5173
```

---

# Using the Application

## 1. Register

Create a new user account from the registration flow.

## 2. Login

Authenticate using the registered email and password.

The frontend stores the Sanctum token and sends it with authenticated API requests.

## 3. Create a Shipping Label

Navigate to **New Shipping Label** and provide:

### From Address

* Name
* Street
* City
* State
* ZIP Code
* Phone
* Email

### To Address

* Name
* Street
* City
* State
* ZIP Code
* Phone
* Email

### Package

* Weight in ounces
* Length in inches
* Width in inches
* Height in inches

Only United States addresses are supported by this prototype.

## 4. Generate the Label

When the form is submitted:

1. The frontend sends the shipment information to Laravel.
2. Laravel creates the shipment in EasyPost.
3. Laravel filters the available rates to USPS.
4. The cheapest USPS rate is automatically selected.
5. Laravel purchases the selected rate.
6. The generated label information is stored in MySQL.
7. The frontend opens the generated label.
8. The label becomes available in the user's shipping label history.

---

# API Overview

## Authentication

### Register

```http
POST /api/register
```

### Login

```http
POST /api/login
```

### Logout

```http
POST /api/logout
Authorization: Bearer <token>
```

---

## Shipping Labels

### Create a label

```http
POST /api/shipping-labels
Authorization: Bearer <token>
```

### List the current user's labels

```http
GET /api/shipping-labels
Authorization: Bearer <token>
```

### Get a specific label

```http
GET /api/shipping-labels/{id}
Authorization: Bearer <token>
```

Shipping labels are always queried through the authenticated user.

This ensures that a user cannot access another user's shipping labels by simply changing the label ID.

---

# Assumptions

The assignment leaves some implementation details open, so the following assumptions were made for this prototype.

### USPS service selection

The user is not asked to select a USPS service.

Instead, the backend:

* retrieves the available EasyPost rates;
* filters the rates to USPS;
* automatically selects the cheapest USPS rate.

This keeps the prototype simple while still providing a real shipping label.

### United States only

Both origin and destination addresses are restricted to the United States.

The country is therefore fixed to `US` in the frontend and validated by the backend.

### Address fields

The prototype uses:

* Name
* Street
* City
* State
* ZIP Code
* Phone
* Email

A second street/address line is intentionally not included to keep the prototype focused.

### Package units

Package dimensions are entered in inches and weight is entered in ounces.

### Purchased timestamp

The `shipping_labels.created_at` timestamp is used as the purchase timestamp.

The database record is created only after the EasyPost shipment has been successfully purchased, so this timestamp represents when the label was persisted after purchase.

### Authentication

Laravel Sanctum personal access tokens are used for API authentication.

For the scope of this prototype, the token is stored by the frontend and sent as a Bearer token.

---

# Data Model

The main application relationship is:

```text
User
 │
 │ 1:N
 ▼
ShippingLabel
```

Each `ShippingLabel` belongs to exactly one user.

The shipping label stores information such as:

* EasyPost shipment ID
* EasyPost rate ID
* Carrier
* Service
* Rate
* Currency
* Tracking code
* Label URL
* PDF label URL
* Status
* Creation timestamp

The backend always retrieves labels through the authenticated user:

```php
$request->user()->shippingLabels()
```

This provides the ownership boundary required by the application.

---

# Error Handling

The backend validates incoming shipment data before communicating with EasyPost.

Examples include:

* Required address fields
* Two-character state codes
* Valid US ZIP codes
* Positive package dimensions
* Positive package weight
* Valid email addresses when provided

The frontend also provides basic browser-level validation to improve the user experience.

Server-side validation remains the authoritative validation layer.

---

# What I'd Do Next

Given more development time, I would consider the following improvements:

### 1. Better EasyPost error handling

Add dedicated handling for EasyPost API errors and return more user-friendly messages to the frontend.

For example:

```text
Unable to generate the label because the address could not be validated.
```

instead of exposing a generic API error.

### 2. Label details page

Instead of opening the label immediately after generation, add a dedicated label details page containing:

* Shipping information
* Selected USPS service
* Price
* Tracking number
* Label preview
* Print button

### 3. Better address validation

Integrate address verification so invalid or incomplete addresses can be detected before purchasing postage.

### 4. Automated tests

Add:

* Laravel feature tests for authentication
* Shipping label API tests
* Authorization/ownership tests
* EasyPost service tests with mocked HTTP responses
* React component tests for the main user flows

A particularly important test would verify that one user cannot access another user's labels.

### 5. Improved authentication persistence

The current prototype uses a client-side token stored in browser storage.

For a production application, I would evaluate a more robust authentication/session strategy depending on the deployment architecture and security requirements.

### 6. Pagination

The shipping label history currently loads all labels.

For a production application, I would add server-side pagination and filtering.

### 7. Idempotency and failure recovery

Shipping purchases involve an external payment/postage operation.

A production implementation should account for scenarios where:

* EasyPost successfully purchases postage but the database save fails;
* the client retries a request;
* network failures occur after the purchase.

Idempotency keys and a more explicit shipment state machine would help prevent duplicate purchases and make recovery safer.

### 8. Production infrastructure

For production, I would also add:

* HTTPS
* Secure secret management
* Proper CORS configuration
* Application logging
* Monitoring
* Rate limiting
* CI/CD
* Database backups

---

# Project Structure

```text
shipping-turno-app/
│
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Requests/
│   │   ├── Models/
│   │   └── Services/
│   │       └── EasyPost/
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   └── api.php
│   ├── .env
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── context/
│   │   ├── pages/
│   │   └── types/
│   ├── .env
│   └── ...
│
├── docker-compose.yml
└── README.md
```

---

# Development Commands

## Backend

Start Laravel:

```bash
cd backend
php artisan serve
```

Run migrations:

```bash
php artisan migrate
```

Clear configuration cache:

```bash
php artisan config:clear
```

List API routes:

```bash
php artisan route:list --path=api
```

---

## Frontend

Start Vite:

```bash
cd frontend
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Database

Start MySQL:

```bash
docker compose up -d
```

Stop MySQL:

```bash
docker compose down
```

Stop MySQL and remove the database volume:

```bash
docker compose down -v
```

> `docker compose down -v` permanently removes the local MySQL data stored in the Docker volume.

---

# Notes

This project was intentionally kept relatively small and focused on the core requirements of the assignment:

* Authentication
* User-specific shipping labels
* USPS rate selection
* EasyPost integration
* Persistent label history
* React user interface
* MySQL persistence

The implementation favors simplicity and clear separation of responsibilities over introducing additional infrastructure or abstractions that are not necessary for the prototype.

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
Username: admin
Password: admin
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
DB_USERNAME=admin
DB_PASSWORD=admin
```

Configure EasyPost:

```env
EASYPOST_API_KEY=easy_post_secret_key_passed_by_email
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

# Data Model

The main application relationship is:

```text
User
 1:N
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

EasyPost API returns status as UNKNOW then I set as PURCHASED after completion.

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

The current implementation focuses on the core requirements of the assignment and was intentionally kept simple to fit the scope of an MVP.

Given more development time, I would improve the application in the following areas:

### 1. More robust data validation

Improve both frontend and backend validation to provide more detailed feedback to users.

For example:

* More specific validation messages for each address field
* Stronger validation for ZIP codes and phone numbers
* Additional validation for package dimensions and weight
* Better handling of invalid or incomplete addresses
* Validation of business rules before sending the request to EasyPost

The backend would remain the authoritative validation layer, while the frontend would provide immediate feedback and a better user experience.

### 2. Shipping label filters

Add filters to the shipping label history table to make it easier to find previously generated labels.

Possible filters include:

* Date range
* USPS service
* Status
* Price range
* Tracking number

I would also add server-side pagination as the number of labels grows.

### 3. Label preview modal

Instead of immediately opening the generated label in a new browser tab, I would add a modal to preview the shipping label directly inside the application.

The modal could provide:

* Label preview
* Tracking number
* USPS service
* Shipping price
* Print button
* Option to open/download the original label

This would provide a smoother workflow while keeping the user on the shipping label history page.

### 4. Better EasyPost error handling

Add dedicated handling for EasyPost API errors and return more user-friendly messages to the frontend.

For example, instead of displaying a generic error, the application could explain that the address could not be validated or that no USPS rate is available.

### 5. Automated tests

Add automated tests covering the main application flows, including:

* User registration and authentication
* Shipping label creation
* EasyPost API integration using mocked responses
* Shipping label ownership and authorization
* Validation rules
* React form and table behavior

A particularly important test would verify that one user cannot access another user's shipping labels.

### 6. Idempotency and failure recovery

Shipping label creation involves an external API and a postage purchase, so the production implementation should handle partial failures more carefully.

For example:

* EasyPost successfully purchases the postage but the database save fails
* The client retries the request
* A network error occurs after the purchase but before the client receives the response

An idempotency strategy and more explicit shipment states could help prevent duplicate purchases and make these scenarios recoverable.

### 7. Improved authentication and security

For a production application, I would review the current token-based authentication approach and consider a more secure session/token strategy depending on the deployment architecture.

I would also add production-level security configurations such as:

* HTTPS
* Secure secret management
* Proper CORS configuration
* API rate limiting
* Security-focused logging and monitoring


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
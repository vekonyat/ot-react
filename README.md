# OfferTool – Offer Management Web Application

This is a full-stack web application developed as part of my thesis project.

The goal of the system is to support and automate the offer creation process for a service provider company.

## Tech Stack

- Frontend: React
- Backend: Node.js (Express)
- Database: PostgreSQL
- File handling: Multer
- Document generation: Docxtemplater

## Features

- Create and manage offers
- Add multiple service components to an offer
- Upload and manage documents
- Generate dynamic Word documents
- Statistics and reporting

## Screenshots

### Main screen

![Main screen](docs/images/main.png)

### Statistics

![Statistics](docs/images/stats.png)

### Main screen

![Files screen](docs/images/file.png)

### Statistics

![Freeform screen](docs/images/free.png)

## Project Structure

- `/src` → React frontend
- `/backend` → Node.js backend
- `/uploads` → uploaded files (ignored in git)

## Getting Started

### 1. Install dependencies

npm install

### 2. Setup environment variables

Create a `.env` file based on `.env.example`:

DB_USER=postgres  
DB_HOST=localhost  
DB_NAME=offertool  
DB_PASSWORD=your_password  
DB_PORT=5432

### 3. Start backend

node backend/server.js

### 4. Start frontend

npm start

Open in browser:

http://localhost:3000

## Notes

This project was created for educational purposes and uses dummy/local data in this public version.

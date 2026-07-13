# 🌍 Wanderlust – Explore Extraordinary Stays Around the World

A full-stack travel accommodation platform where users can explore unique stays across the world. Wanderlust allows users to browse, search, filter, and manage listings while providing secure authentication, interactive maps, and a seamless user experience.

---

## 🚀 Live Demo

🔗 https://wanderlust-project-tott.onrender.com/listings

---

## ✨ Features

- 🏠 Create, Read, Update, and Delete (CRUD) Listings
- 🔐 User Authentication (Sign Up, Login & Logout)
- 🛡️ Authorization (Only owners can edit/delete their listings)
- 📍 Interactive Map Integration for listing locations
- 🔍 Search listings by title, country, or location
- 🏷️ Category-based filtering
- 💰 Tax Toggle (Show/Hide GST)
- ☁️ Cloudinary Image Upload & Storage
- ⭐ Review and Rating System
- 📱 Fully Responsive UI
- ⚡ Flash Messages for user feedback
- 🚫 Form Validation on both client and server side
- 🗺️ Automatic Geocoding using OpenStreetMap

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- Bootstrap 5
- EJS (Embedded JavaScript Templates)
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Authorization
- Passport.js
- Passport Local Strategy
- Express Session
- Connect-Mongo

### Image Storage
- Cloudinary
- Multer
- Multer Storage Cloudinary

### Maps & Geolocation
- OpenStreetMap
- Node Geocoder

### Architecture
- MVC (Model-View-Controller)

---

## 📂 Project Structure

```
Wanderlust
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── views/
├── public/
│   ├── css/
│   ├── js/
│
├── utils/
├── cloudConfig.js
├── app.js
└── package.json
```

---

## 🔐 Authentication Flow

- User Registration
- User Login
- Secure Password Hashing
- Session-based Authentication
- Protected Routes
- Owner-only Edit/Delete Permissions

---

## 🌟 Core Functionalities

### Listings
- Add new listings
- Edit existing listings
- Delete listings
- Upload listing images
- View listing details

### Search & Filter
- Search by title
- Search by location
- Search by country
- Filter by category

### Reviews
- Add reviews
- Give star ratings
- Delete own reviews

### Maps
- Automatic location coordinates
- Interactive map on listing page

---

## 📦 Packages Used

- express
- mongoose
- ejs
- ejs-mate
- passport
- passport-local
- passport-local-mongoose
- express-session
- connect-mongo
- multer
- cloudinary
- multer-storage-cloudinary
- node-geocoder
- connect-flash
- method-override
- dotenv

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/your-username/wanderlust.git
```

Go to project directory

```bash
cd wanderlust
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
ATLASDB_URL=
SECRET=

CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_SECRET=
```

Run the project

```bash
npm start
```

Open

```
http://localhost:8080/listings
```

---

## 🎯 Future Improvements

- Wishlist / Favorites
- Booking System
- Payment Gateway Integration
- User Profiles
- Image Gallery
- Email Notifications
- Admin Dashboard

---

## 👨‍💻 Author

**Naveen Kumar**

B.Tech | Instrumentation & Control Engineering

Dr. B.R. Ambedkar National Institute of Technology, Jalandhar
---

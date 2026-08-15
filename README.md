# 🌍 WanderLust – Explore Extraordinary Stays Around the World

A full-stack travel accommodation platform where users can explore unique stays, search and filter listings, manage properties, check availability, make bookings, securely process payments, cancel bookings, receive refunds, and manage their complete booking history.

🔗 **Live Demo:** https://wanderlust-project-tott.onrender.com/listings

---

## ✨ Features

### 🏠 Listing Management

- Create new accommodation listings
- View listing details
- Edit listings
- Delete listings
- Upload listing images
- Cloudinary image storage
- Owner-only edit/delete authorization
- Dynamic listing prices
- Listing categories
- Location and country information

### 🔐 Authentication & Authorization

- User registration
- User login
- User logout
- Secure password hashing
- Passport.js authentication
- Passport Local Strategy
- Session-based authentication
- MongoDB session storage
- Protected routes
- Authorization middleware
- Owner-only listing modification
- Owner-only listing deletion
- User-specific booking access

### 🔍 Search & Filtering

Users can discover listings using:

- Search by title
- Search by location
- Search by country
- Category-based filtering
- Explore listings
- Responsive listing cards

### 💰 Pricing & Tax

- Dynamic listing prices
- GST / tax toggle
- Automatic price calculation
- Automatic number-of-nights calculation
- Booking total calculation

### ⭐ Reviews & Ratings

- Add reviews
- Give star ratings
- View reviews
- Delete own reviews
- Review authorization
- Rating display
- Average rating calculation

### 🗺️ Maps & Geolocation

- OpenStreetMap integration
- Automatic geocoding
- Node Geocoder
- Latitude and longitude generation
- Interactive maps on listing pages
- Location-based listing information

---

# 📅 Booking System

WanderLust includes a complete booking management system.

Users can:

- Check property availability
- Select check-in and check-out dates
- Select number of guests
- Calculate booking price
- Create bookings
- Make online payments
- View booking details
- View booking history
- Cancel bookings
- Receive refunds
- Remove completed/cancelled bookings from their booking history

---

## 🔎 Availability Checking

Before creating a booking, the user provides:

- Check-in date
- Check-out date
- Number of guests

The server validates all booking information.

### Date Validation

- Check-in must be a valid date
- Check-out must be a valid date
- Check-in cannot be in the past
- Check-out must be after check-in

### Guest Validation

- Guest count must be a valid integer
- At least one guest is required

### Booking Conflict Validation

Existing:

- Pending bookings
- Confirmed bookings

are checked before creating a new booking.

If the requested dates overlap an existing booking, the request is rejected.

```text
User selects dates
        ↓
Validate dates
        ↓
Validate guests
        ↓
Find existing bookings
        ↓
Check date overlap
        ↓
Available?
   ┌────┴────┐
   │         │
  YES        NO
   │         │
   ▼         ▼
Continue    Error
   │
   ▼
Pending
   │
   ▼
Payment

💳 Razorpay Payment Integration
WanderLust integrates Razorpay for online booking payments.

Payment Flow

User selects listing
        ↓
Check availability
        ↓
Enter dates & guests
        ↓
Server-side validation
        ↓
Check date conflicts
        ↓
Create pending booking
        ↓
Create Razorpay order
        ↓
Open Razorpay Checkout
        ↓
User completes payment
        ↓
Receive payment details
        ↓
Verify Razorpay signature
        ↓
Payment verified
        ↓
Booking confirmed
        ↓
Booking success page

📋 My Bookings

Users have a dedicated My Bookings page where they can view and manage their bookings.

Each booking displays:

Property name
Property location
Check-in date
Check-out date
Number of guests
Total price
Booking status
Payment status

Users can click View Booking to see complete booking details.

🗑️ Remove Booking From My Bookings

Users can remove old bookings from their booking history.

Only:
Cancelled bookings
Completed bookings
can be removed.

🏗️ MVC Architecture

WanderLust follows the MVC (Model-View-Controller) architecture.

                         WanderLust
                             │
             ┌───────────────┼───────────────┐
             │               │               │
             ▼               ▼               ▼
           Models       Controllers        Views
             │               │               │
             ▼               ▼               ▼
          MongoDB       Business Logic      EJS
                             │
                             ▼
                           Routes
                             │
                             ▼
                         Express.js

📂 Project Structure
WanderLust/
│
├── controllers/
│   ├── booking.js
│   └── listing.js
│
├── models/
│   ├── booking.js
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/
│   ├── booking.js
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── middleware/
│
├── views/
│   ├── bookings/
│   │   ├── index.ejs
│   │   ├── details.ejs
│   │   ├── payment.ejs
│   │   ├── success.ejs
│   │   └── summary.ejs
│   │
│   ├── listings/
│   │   ├── availabilityCheck.ejs
│   │   └── show.ejs
│   │
│   ├── users/
│   ├── reviews/
│   └── includes/
│
├── public/
│   ├── css/
│   └── js/
│
├── utils/
│
├── cloudConfig.js
├── app.js
├── package.json
└── README.md

🛠️ Tech Stack

Frontend
HTML5
CSS3
Bootstrap 5
EJS
JavaScript
Backend
Node.js
Express.js
Database
MongoDB
Mongoose
Authentication
Passport.js
Passport Local Strategy
Passport Local Mongoose
Express Session
Connect-Mongo
Image Storage
Cloudinary
Multer
Multer Storage Cloudinary
Maps & Geolocation
OpenStreetMap
Node Geocoder
Payment Gateway
Razorpay
Other Technologies
EJS Mate
Connect Flash
Method Override
Dotenv
Deployment
GitHub
Render

User Experience
The application includes:

Flash messages
Client-side validation
Server-side validation
Error handling
Confirmation dialogs
Responsive UI
Booking summary
Payment page
Payment success page
Booking details page
My Bookings page
Responsive navigation
Payment feedback


# ThriftTrove

**ThriftTrove** is an e-commerce platform designed for buying and selling second-hand items, providing users with a seamless experience for browsing products, viewing details, and making secure purchases. The platform incorporates **user authentication**, **image hosting**, **payment processing**, and **interactive maps** to offer a complete marketplace solution.

## Features

- **User Authentication**: Secure login and registration using **JWT** and **OAuth** (Google/Facebook).
- **Product Listings**: Browse, view, and search for items on sale, complete with product descriptions and images.
- **Image Hosting**: Integrated with **Cloudinary** for uploading and managing product images.
- **Secure Payments**: Payments are processed securely using **Stripe**.
- **(UNDER DEVELOPMENT)  Interactive Maps**: **Leaflet Maps** are used to display sellers' locations, enabling users to find nearby items.
- **(UNDER DEVELOPMENT)  Responsive Design**: Optimized for mobile and desktop devices.
- **(UNDER DEVELOPMENT) Testing**: Unit and integration testing implemented to ensure code quality and functionality.

## Tech Stack

- **Front-End**: React.js, Bootstrap, CSS
- **Back-End**: Node.js, Express.js
- **Database**: PostgreSQL
- **APIs**: Cloudinary (image hosting), Stripe (payments)
- **Authentication**: JWT (JSON Web Token)

## Installation and Setup

To set up **ThriftTrove** locally, follow these steps:

### Prerequisites
- Node.js and npm (Node Package Manager)
- PostgreSQL (for database)
- Cloudinary and Stripe API keys

### Steps

1. **Clone the Repository:**
   ```
   bash
   git clone https://github.com/yourusername/thrifttrove.git
   cd thrifttrove
   ```
2. **Install dependencies:**
   ```npm install```
3. Configure Environment Variables: Create a .env file in the root directory and include the following:
   ```
   PORT=5000
   DATABASE_URL=your_postgresql_database_url
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   JWT_SECRET=your_jwt_secret
   ```
4. Set Up the Database: Ensure PostgreSQL is running and create the necessary tables. (NOT CONFIGURED YET SORRY)
   ```
   npm run migrate
   ```
5. Run the application:
   ```npm start```
6. Access the App: Visit http://localhost:5000 in your browser to start using ThriftTrove.

## Testing
Run unit and integration tests using the following command:
```npm run test```

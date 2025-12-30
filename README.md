# MERN User Management System

## Project Overview & Purpose
This is a full-stack MERN (MongoDB, Express, React, Node.js) application designed for secure user authentication and administrative oversight. The project features a responsive React UI with functional Signup, Login, and an Admin Dashboard to manage user data.

## 1. Tech Stack Used
* **Frontend**: React, Vite, Axios, React-Router-Dom, React-Toastify.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB Atlas (Mongoose ODM).
* **Deployment**: Vercel (Frontend) and Render (Backend).


## 2. Setup Instructions

### Backend Setup
1. Navigate to the `backend` folder.
2. Install dependencies: `npm install`.
3. Create a `.env` file with your `MONGO_URI` and `JWT_SECRET`.
4. Start the server: `node server.js`.

### Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies: `npm install`.
3. Create a `.env` file and add `VITE_API_URL`.
4. Start the development server: `npm run dev`.

## 3. Environment Variables

### Backend (`/backend/.env`)
* `PORT`: Server port (e.g., 5000).
* `MONGO_URI`: MongoDB Atlas connection string.
* `JWT_SECRET`: Secret key for authentication tokens.

### Frontend (`/frontend/.env`)
* `VITE_API_URL`: The deployed Render backend URL ending in `/api`.

## 4. Deployment Instructions

### Backend (Render)
1. Connect the GitHub repository to Render.
2. Add all environment variables in the **Environment** tab.
3. Deploy the service.

### Frontend (Vercel)
1. Connect the repository to Vercel.
2. In **Settings > Environment Variables**, add `VITE_API_URL` set to `https://mern-backend-api-3sqm.onrender.com/api`.
3. Trigger a **Redeploy** to apply the settings.

## 5. API Documentation

### Auth Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/auth/register` | Register a new user account. |
| **POST** | `/auth/login` | Authenticate user and return a JWT. |
| **GET** | `/auth/me` | Fetch current user profile (Protected). |


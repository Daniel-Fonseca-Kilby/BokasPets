# 🐾 BokasPets

> A full-stack pet management platform built with modern web technologies.

![React](https://img.shields.io/badge/react-19.2.5-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-5.x-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-22.x-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)

BokasPets is a comprehensive web application designed to help pet owners manage their pet's needs, subscriptions, and profiles. With a secure backend and a responsive, interactive user interface, it provides a seamless experience for both users and administrators.

## ✨ Features

- **User Authentication**: Secure Login & Registration using JWT and Bcrypt.
- **Interactive Dashboard**: View insights, metrics, and manage pet profiles.
- **Role-based Access**: Dedicated Admin panel for managing users and platform data.
- **Subscription Plans**: View and manage service tiers.
- **Profile Management**: Update user and pet details, including image uploads via Cloudinary.
- **Responsive Design**: Beautiful, mobile-friendly UI built with Material UI & Framer Motion.

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Material UI (MUI), Emotion, Framer Motion
- **Routing**: React Router DOM
- **Data Visualization**: Recharts
- **Icons**: Lucide React

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **Storage**: Cloudinary & Multer
- **Validation**: Zod
- **Email Services**: Resend

## 🚀 Getting Started

### Prerequisites

- Node.js (v22 or higher)
- MongoDB running locally or a MongoDB Atlas URI
- Cloudinary Account (for image uploads)
- Resend Account (for emails)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/bokaspets.git
   cd bokaspets
   ```

2. **Install dependencies for both frontend and backend**

   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Set up Environment Variables**
   ### Environment Variables

Create a `.env` file in `/server` with the following:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RESEND_API_KEY=your_resend_key
PORT=5000
```

4. **Run the Application Locally**
   We use `concurrently` to run both the Vite dev server and the Node.js backend simultaneously.
   ```bash
   npm run dev:all
   ```

   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000` (or your configured port)

## 📁 Project Structure

```text
bokaspets/
├── public/             # Static assets
├── server/             # Node.js Express backend
│   ├── src/            # Controllers, Models, Routes, Middlewares
│   └── server.js       # Entry point
├── src/                # React frontend
│   ├── components/     # Reusable UI components
│   ├── context/        # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Application pages (Dashboard, Login, etc.)
│   ├── services/       # API integration
│   ├── theme/          # MUI theme configuration
│   └── utils/          # Helper functions
└── package.json        # Root dependencies and scripts
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/Daniel-Fonseca-Kilby/bokaspets/issues).

## 📝 License

This project is licensed under the [ISC License](LICENSE).

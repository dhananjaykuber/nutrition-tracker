# Health Tracker

A comprehensive nutrition tracking web application built with Next.js, TypeScript, Tailwind CSS, Shadcn UI, and Firebase. Track your daily food intake, monitor macronutrients, and analyze your nutritional patterns over time.

## Features

### Authentication

- Secure user registration and login with Firebase Auth
- Protected routes for authenticated users

### Food Management

- Create custom food items with detailed nutritional information
- Manage your personal food database
- Specify serving sizes and units for accurate tracking

### Daily Food Tracking

- Log food consumption with customizable serving amounts
- Real-time calculation of nutritional values
- Track protein, carbohydrates, fat, and calories
- Delete or modify food entries

### Nutritional Analytics

- Daily summary with macro distribution visualization
- Weekly history and trends
- Color-coded macro percentage breakdowns
- Average daily intake calculations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **State Management**: React Context API

## Project Structure

```
health-tracker/
├── app/
│   ├── (protected)/           # Protected routes requiring authentication
│   │   ├── dashboard/         # Main dashboard page
│   │   ├── food/
│   │   │   ├── add/          # Add new food items
│   │   │   ├── log/          # Log daily food entries
│   │   │   └── history/      # View historical data
│   │   └── layout.tsx        # Protected routes layout
│   ├── auth/
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   └── layout.tsx        # Auth pages layout
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Home page with auth redirects
├── components/
│   ├── auth/
│   │   ├── login-form.tsx    # Login form component
│   │   ├── protected-route.tsx # Protected route wrapper
│   │   └── register-form.tsx # Registration form component
│   ├── food/
│   │   ├── daily-summary.tsx # Daily nutrition summary
│   │   ├── food-entry-form.tsx # Form for logging food
│   │   ├── food-item-form.tsx # Form for creating food items
│   │   ├── food-list.tsx     # List of user's food items
│   │   └── weekly-summary.tsx # Weekly nutrition analytics
│   ├── layout/
│   │   ├── header.tsx        # App header with navigation
│   │   └── sidebar.tsx       # Navigation sidebar
│   └── ui/                   # Shadcn UI components
├── lib/
│   ├── firebase.ts           # Firebase configuration
│   ├── food-service.ts       # Food-related API functions
│   ├── types.ts              # TypeScript type definitions
│   └── utils.ts              # Utility functions
├── providers/
│   └── auth-provider.tsx     # Authentication context provider
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd health-tracker
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Set up Firebase:

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Enable Authentication and select Email/Password sign-in method
   - Create a Firestore database
   - Get your Firebase configuration from Project Settings

4. Create environment variables:

```bash
cp .env.example .env.local
```

5. Fill in your Firebase configuration in `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

6. Run the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Firebase Setup

### Firestore Security Rules

Add these security rules to your Firestore database:

```javascript
rules_version = '2';

service cloud.firestore {
 match /databases/{database}/documents {
   match /{document=**} {
     allow read, write: if true;
   }
 }
}
```

## Usage Guide

### 1. Creating an Account

- Navigate to the registration page
- Enter your email and password
- You'll be automatically logged in and redirected to the dashboard

### 2. Adding Food Items

- Go to "Add Food Item" from the sidebar
- Enter the food name and nutritional information per serving
- Specify serving size and unit
- The food item will be saved to your personal database

### 3. Logging Daily Food

- Go to "Log Food" from the sidebar
- Select a food item from your database
- Enter the number of servings consumed
- Choose the date (defaults to today)
- View real-time nutrition calculations before submitting

### 4. Viewing Analytics

- **Dashboard**: See today's summary and macro distribution
- **History**: View weekly trends and daily breakdowns
- Navigate between dates to see historical data

## Development

### Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Environment Variables

```
# Firebase Configuration (all required)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

Built with ❤️ using Next.js and Firebase

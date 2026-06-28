# Firebase Setup Guide

## Overview
This admin panel integrates with Firebase for authentication and Firestore for persistent data storage. Follow these steps to configure your Firebase project.

## Step 1: Add Web App to Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your existing project (the one you used for Flutter)
3. **Project Settings** → **"Add app" button** → Select **"Web" (`</>`)**
4. Register app with name `aemirkalafat-web` (or any name you prefer)
5. Copy the `firebaseConfig` object shown on the next screen

Your config should look like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def..."
};
```

## Step 2: Configure Environment Variables

1. Open `.env` in the project root
2. Replace the placeholder values with your Firebase config:

```
VITE_FIREBASE_API_KEY=AIzaSy...  # Copy from firebaseConfig.apiKey
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def...
```

3. Save and restart the dev server: `npm run dev`

## Step 3: Enable Email/Password Authentication

1. Go to **Firebase Console** → Your Project
2. **Authentication** → **Sign-in method**
3. Click **Email/Password**
4. Enable both toggle switches (Email/Password and Password-less)
5. Click **Save**

## Step 4: Create Admin User

1. **Authentication** → **Users**
2. Click **"Add user"** button
3. Enter your admin email: `admin@example.com` (or your email)
4. Enter a strong password
5. Click **Create user**
6. **Copy the User UID** (shown in the users table) — you'll need this for Firestore rules

## Step 5: Create Firestore Database

1. **Firestore Database** → **Create database**
2. Choose **Production mode**
3. Select your region (closest to your location)
4. Click **Create**
5. Wait for database to initialize (~1 minute)

## Step 6: Set Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Replace the entire rules with this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Allow anyone to read
      allow read: if true;
      // Allow writes only from authenticated admin
      allow write: if request.auth != null && request.auth.uid == "YOUR_ADMIN_UID_HERE";
    }
  }
}
```

3. Replace `YOUR_ADMIN_UID_HERE` with the UID you copied in Step 4
4. Click **Publish**

## Step 7: Authorize Localhost

1. **Authentication** → **Settings** → **Authorized domains**
2. Verify `localhost` is in the list (it should be by default)
3. (Later: add your production domain here)

## Step 8: Seed Initial Data

1. Run the dev server: `npm run dev`
2. Navigate to `http://localhost:5174/login`
3. Log in with the admin credentials from Step 4 (email + password)
4. You'll land on **`/admin` dashboard**
5. Click the **"SEED_DB"** button to import the existing static content into Firestore
6. Wait for success message (takes a few seconds)

## Step 9: Test the Setup

1. Visit `http://localhost:5174/blog`
2. You should see your blog posts loaded from Firestore
3. Go back to `/admin/blog`
4. Add or edit a post
5. Return to `/blog` — the changes should appear live

## Troubleshooting

**"Giriş başarısız" (Login failed) error:**
- Verify `.env` values match your Firebase config exactly
- Check that Email/Password auth is enabled in Firebase
- Confirm the user exists in Firebase Authentication

**Blog/Projects/Media show empty:**
- Click **SEED_DB** button on admin dashboard
- Verify Firestore database was created and is not empty
- Check browser console for Firestore permission errors

**"PERMISSION_DENIED" errors in console:**
- Verify your admin UID in Firestore rules (Step 6) is correct
- Re-publish the rules after updating

**Can't log out or stuck on login:**
- Clear browser localStorage: F12 → Application → LocalStorage → Clear All
- Refresh the page

## File Locations

- Environment variables: `.env` (root directory)
- Firebase initialization: `src/firebase/index.ts`
- Auth composable: `src/composables/useAuth.ts`
- Firestore helpers: `src/services/db.ts`
- Data composables: `src/composables/use{Blog,Projects,Media}.ts`

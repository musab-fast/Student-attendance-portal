# Deployment Guide: Student Attendance and Result Portal

This guide covers the step-by-step process to deploy your MERN stack application.
- **Backend**: Deployed to **Render** (Free tier available).
- **Frontend**: Deployed to **Vercel** (Free tier available).

---

## Prerequisites

1.  **GitHub Account**: You need a GitHub account to host your code.
2.  **Render Account**: Sign up at [render.com](https://render.com/).
3.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com/).
4.  **Git Installed**: Ensure Git is installed on your computer.

---

## Step 1: Push Code to GitHub

1.  **Initialize Git** (if not already done):
    ```bash
    git init
    ```

2.  **Create a `.gitignore` file** in the root directory (if not exists) and add:
    ```
    node_modules
    .env
    ```

3.  **Commit your code**:
    ```bash
    git add .
    git commit -m "Ready for deployment"
    ```

4.  **Create a new Repository on GitHub**:
    - Go to GitHub and create a new repository (e.g., `student-portal`).
    - Do **not** initialize with README, .gitignore, or License.

5.  **Push to GitHub**:
    - Copy the commands provided by GitHub (under "…or push an existing repository from the command line") and run them in your terminal. It usually looks like:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/student-portal.git
    git branch -M main
    git push -u origin main
    ```

---

## Step 2: Deploy Backend to Render

1.  **Create a Web Service**:
    - Go to your [Render Dashboard](https://dashboard.render.com/).
    - Click **New +** -> **Web Service**.
    - Connect your GitHub account and select the `student-portal` repository.

2.  **Configure the Service**:
    - **Name**: `student-portal-api` (or similar).
    - **Region**: Choose the one closest to you.
    - **Branch**: `main`.
    - **Root Directory**: `server` (Important!).
    - **Runtime**: `Node`.
    - **Build Command**: `npm install` (default is usually fine, but ensure it installs dependencies).
    - **Start Command**: `node index.js` (or `npm start`).

3.  **Environment Variables**:
    - Scroll down to "Environment Variables" and click **Add Environment Variable**.
    - Add the following keys and values from your local `.env` file:
        - `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb+srv://...`).
        - `JWT_SECRET`: Your secret key for authentication.
        - `PORT`: `5000` (Render might override this, but good to have).

4.  **Deploy**:
    - Click **Create Web Service**.
    - Wait for the deployment to finish. You will see "Live" status.
    - **Copy the Backend URL**: It will look like `https://student-portal-api.onrender.com`. You will need this for the frontend.

---

## Step 3: Deploy Frontend to Vercel

1.  **Import Project**:
    - Go to your [Vercel Dashboard](https://vercel.com/dashboard).
    - Click **Add New...** -> **Project**.
    - Import the `student-portal` repository.

2.  **Configure Project**:
    - **Framework Preset**: Create React App (should be detected automatically).
    - **Root Directory**: Click "Edit" and select `client`.

3.  **Environment Variables**:
    - Expand the "Environment Variables" section.
    - Add the following variable:
        - **Name**: `REACT_APP_API_URL`
        - **Value**: The Render Backend URL you copied in Step 2 (e.g., `https://student-portal-api.onrender.com/api`). **Important**: Make sure to append `/api` at the end if your backend routes start with `/api`.

4.  **Deploy**:
    - Click **Deploy**.
    - Vercel will build your React app.
    - Once done, you will get a **Live URL** for your frontend (e.g., `https://student-portal.vercel.app`).

---

## Step 4: Verification

1.  Open your Vercel Frontend URL.
2.  Try to **Login** (this tests the connection to the backend).
3.  If login works, your full stack application is successfully deployed!

---

## Troubleshooting

-   **CORS Issues**: If you see CORS errors in the browser console, check your `server/index.js`. Ensure `cors` is enabled and configured to allow requests from your Vercel domain.
    -   *Quick Fix*: In `server/index.js`, `app.use(cors())` allows all origins. For production, you might want to restrict it:
        ```javascript
        app.use(cors({
            origin: 'https://your-vercel-app.vercel.app'
        }));
        ```
-   **404 on Refresh**: If refreshing a page gives a 404 error, ensure `client/vercel.json` exists and is configured correctly (we already created this file).

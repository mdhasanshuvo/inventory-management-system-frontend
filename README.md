# Smart Inventory & Order Management System - Frontend

Production-style React admin panel for inventory operations, category and product management, order lifecycle handling, restock queue workflows, dashboard insights, and recent activity tracking.

## Tech Stack
- React.js
- React Router
- Axios
- Context API (authentication state)
- CSS

## Features
- Login and signup pages with validation
- Demo login auto-fill button
- JWT session handling with protected routes
- Dashboard insights and latest activities
- Category create/list workflow
- Product create/update/list workflow
- Order create/status update/filter workflow
- Restock queue management and quick restock action

## Setup
1. Install dependencies:
	- `npm install`
2. Configure environment:
	- copy `.env.example` to `.env`
3. Start development server:
	- `npm run dev`
4. Build production bundle:
	- `npm run build`

## Environment Variables
- `VITE_API_BASE_URL`

## Routing Pages
- `/login`
- `/signup`
- `/dashboard`
- `/categories`
- `/products`
- `/orders`
- `/restock`

## Deployment (Netlify)
1. Push repository to GitHub
2. Import project in Netlify
3. Set `VITE_API_BASE_URL` in Netlify environment variables
4. Deploy

## Notes
- Keep `.env` private and never commit API secrets.
- Ensure backend CORS and API URL are configured correctly.

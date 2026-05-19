# NaukriHub — Admin Panel

React admin panel for the NaukriHub job portal. It talks to the same backend
that powers the public site (`../naukri_website/server`).

## Features

- Admin login (admin-only, separate route)
- Dashboard with platform-wide counts and recent activity
- Manage **Job Seekers**, **Employers**, **Companies**, **Vendors**
- Manage **Jobs** (status, featured, delete)
- Manage **Applications**
- Manage **Categories**

## Prerequisites

The backend in `../naukri_website/server` must be running on `http://localhost:5090`.
Bootstrap the admin account once (the project ships with no seed data):

```bash
cd ../naukri_website/server
npm install
npm run create-admin     # default admin: admin@naukrihub.local / Admin@123
npm run dev
```

You can pass `--email` and `--password` to `node createAdmin.js` to set custom values.
Change the password after first login from the profile page.

## Run the admin panel

```bash
npm install
npm run dev      # starts on http://localhost:5174
```

Visit http://localhost:5174 → log in with the admin credentials you bootstrapped.

## Configure API URL

Edit `.env`:

```
VITE_API_URL=http://localhost:5090/api
VITE_API_BASE=http://localhost:5090
```

## Project structure

```
naukri_admin/
├── index.html
├── vite.config.js (port 5174)
├── tailwind.config.js
└── src/
    ├── api/client.js
    ├── context/AuthContext.jsx     stores admin token in localStorage
    ├── components/
    │   ├── Protected.jsx
    │   └── DataTable.jsx
    ├── layouts/AdminLayout.jsx     sidebar + header
    └── pages/
        ├── Login.jsx
        ├── Dashboard.jsx
        ├── Users.jsx
        ├── Employers.jsx
        ├── Companies.jsx
        ├── Vendors.jsx
        ├── Jobs.jsx
        ├── Applications.jsx
        └── Categories.jsx
```

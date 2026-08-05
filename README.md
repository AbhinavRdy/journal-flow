# Journal Flow

A full-stack task-tracking app with authentication, filtering, search, and cloud data persistence.

## Live Demo

- **Production:** https://journal-flow-6e154.web.app
- **Dev:** https://journal-flow-dev.web.app

## Features

- Add, edit, delete, and mark tasks complete/incomplete
- Due dates and priority levels (Low/Medium/High)
- Filter tasks by All / Active / Completed
- Search tasks by keyword
- Sort by newest-created or priority
- Email/password authentication (Firebase Auth), with tasks private to each user
- Firestore security rules restricting reads/writes to a task's owner

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Firebase (Firestore, Authentication, Hosting)

## Setup

```bash
npm install
npm run dev
```

Requires a `.env` file with your own Firebase project config:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

```

## Deployment

```bash
npm run build
firebase deploy --only hosting:prod
firebase deploy --only hosting:dev
```

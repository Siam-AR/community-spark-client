# Community Spark

## Description
Community Spark is a modern community project-sharing platform where users can discover, publish, and support local initiatives. The app makes it easy to browse community projects, view detailed project pages, add new ideas, and engage through comments.

## Live Project Link
- Live site: https://community-spark-client.vercel.app/

## Screenshot
![Community Spark preview](./public/screenshot.svg)

## Technologies Used
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- HeroUI
- Recharts
- Swiper
- React Icons
- Better Auth
- MongoDB

## Core Features
- Public homepage with featured projects and community stats
- Browse projects with search, category filters, date filters, sorting, and pagination
- View full project details publicly
- Add, edit, and manage your own projects
- Leave comments and interact with project posts
- Secure authentication with login, registration, and Google login
- Responsive layout with dark/light mode support

## Dependencies Used
### Main dependencies
- next
- react
- react-dom
- @heroui/react
- better-auth
- mongodb
- recharts
- swiper
- react-fast-marquee
- react-icons

### Development dependencies
- typescript
- tailwindcss
- eslint
- eslint-config-next
- @types/react
- @types/react-dom
- @types/node

## How to Run Locally
### 1. Clone the repositories
```bash
git clone <your-client-repository-url>
cd idea-vault-client

git clone <your-server-repository-url>
cd idea-vault-server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
The client only needs one environment file in the client project root. The server needs its own environment file in the server project root.

#### Client (.env or .env.local in the client folder)
```env
BETTER_AUTH_SECRET=<generate-a-long-random-secret>
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://<database-user>:<password>@<cluster-host>/?appName=<app-name>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_SECRET=<your-google-client-secret>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

> If you are using a local MongoDB instance instead of Atlas, you can replace the Mongo URI with:
> `mongodb://127.0.0.1:27017/community-spark`

#### Server (.env in the server folder)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<database-user>:<password>@<cluster-host>/?appName=<app-name>
MONGODB_DB_NAME=community-spark
JWT_SECRET=<generate-a-long-random-secret>
CLIENT_URL=http://localhost:3000
BETTER_AUTH_SECRET=<generate-a-long-random-secret>
```

### 4. Start the server
```bash
npm run dev
```

### 5. Start the client
```bash
cd ../idea-vault-client
npm run dev
```

Open http://localhost:3000 in your browser.

### 6. Build for production
```bash
npm run build
npm run start
```

## Additional Resources
- Backend API: https://community-spark-server.vercel.app
- Server repository: https://github.com/Siam-AR/community-spark-server
- Local development preview: http://127.0.0.1:3000
- Live frontend: https://community-spark-client.vercel.app

## Notes
This project combines a polished user interface with a functional community-driven idea management experience for both visitors and authenticated users.

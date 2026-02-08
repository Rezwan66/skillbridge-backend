# Skillbridge Backend 🎓

Postgres, Prisma, Express Backend for Skillbridge lesson-booking platform.

## 🍰 Resources

### System Design

![alt text](skillbridge-system-design.png)

### Entity Relationship Diagram

![alt text](SkillBridge_ER.drawio.png)

### ✅ Getting Started

Follow these steps to set up and run the backend server on your local machine.

Clone the repository and navigate to the cloned repo.

#### Install Dependencies

```bash
npm install
```

#### Configure Environment Variables

Create a `.env` file in the root of your project and add the necessary environment variables.

Example `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/prisma-blog-app?schema=public"
PORT=5000
BETTER_AUTH_SECRET=better-auth-secret
BETTER_AUTH_URL=http://localhost:5000 # Base URL of your app
BACKEND_URL=http://localhost:5000
APP_URL=http://localhost:3000 # Nextjs Frontend
APP_URL=http://localhost:4000 # Postman Frontend
```

#### Run the Server

After configuring the environment variables, run this command to start the project.

```bash
npm run dev
```

### Generate all possible types for our tables:

```powershell
    npx prisma generate
```

### Generate user models & types using Better-Auth:

```powershell
    npx @better-auth/cli generate
```

### Migrate all prisma schemas to SQL database:

```powershell
    npx prisma migrate dev
```

### Run Prisma Studio:

```powershell
    npx prisma studio
```

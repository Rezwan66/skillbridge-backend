import app from './app';
import { prisma } from './lib/prisma';

const port = process.env.PORT || 5000;
const backendUrl = process.env.BACKEND_URL;

async function main() {
  try {
    await prisma.$connect();
    console.log('Connected to the database successfully.');

    app.listen(port, () => {
      console.log(`Server is running on ${backendUrl}`);
    });
  } catch (error) {
    console.error('An error occurred:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();

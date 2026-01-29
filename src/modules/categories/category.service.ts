import { prisma } from '../../lib/prisma';

const createCategory = async (name: string) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive',
      },
    },
  });
  if (existingCategory) {
    throw new Error('Category already exists');
  }

  return await prisma.category.create({
    data: { name },
  });
};

const getAllCategories = async () => {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
};

export const categoryService = { createCategory, getAllCategories };

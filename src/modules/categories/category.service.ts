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
    // where: { isActive: true },
    orderBy: { name: 'asc' },
  });
};

const updateCategoryStatus = async (id: string, isActive: boolean) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: { id },
    select: { id: true, isActive: true },
  });

  if (category.isActive === isActive) {
    throw new Error(
      `Your provided status (${isActive}) is already up to date!`,
    );
  }

  return await prisma.category.update({
    where: { id },
    data: { isActive },
  });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  updateCategoryStatus,
};

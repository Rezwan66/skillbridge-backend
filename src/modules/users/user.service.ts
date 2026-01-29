import { prisma } from '../../lib/prisma';

interface AllowedFields {
  name: string;
  image: string;
}

const updateMe = async (userId: string, payload: AllowedFields) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      name: payload.name,
      image: payload.image,
    },
  });
};

export const userService = {
  updateMe,
};

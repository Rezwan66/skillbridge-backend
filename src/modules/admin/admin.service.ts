import { UserStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

const updateUser = async (id: string, data: { status: UserStatus }) => {
  const validStatuses = Object.values(UserStatus);
  if (!validStatuses.includes(data.status)) {
    throw new Error(
      `Invalid status provided. Allowed values are: ${validStatuses.join(', ')}`,
    );
  }

  const userStatus = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: { id: true, status: true },
  });

  if (userStatus.status === data.status) {
    throw new Error(
      `Your provided status (${data.status}) is already up to date!`,
    );
  }

  return await prisma.user.update({
    where: { id },
    data: { status: data.status },
  });
};

const updateTutorFeaturedStatus = async (
  tutorProfileId: string,
  isFeatured: boolean,
) => {
  const tutorProfile = await prisma.tutorProfile.findUniqueOrThrow({
    where: { id: tutorProfileId },
  });

  if (tutorProfile.isFeatured === isFeatured) {
    throw new Error(
      `Your provided featured status (${isFeatured}) is already up to date!`,
    );
  }

  return await prisma.tutorProfile.update({
    where: { id: tutorProfileId },
    data: { isFeatured },
  });
};

export const adminService = {
  getAllUsers,
  updateUser,
  updateTutorFeaturedStatus,
};

import { Role } from '../../generated/prisma/enums';
import { auth } from '../lib/auth';
import { prisma } from '../lib/prisma';

export interface UserRegisterData {
  name: string;
  email: string;
  password: string;
  role: Role;
}

async function seedAdmin() {
  try {
    console.log('***** Admin Seeding Started *****');
    const adminData: UserRegisterData = {
      name: process.env.ADMIN_NAME!,
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASS!,
      role: Role.ADMIN,
    };

    console.log('***** Checking Existence of Admin *****');
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email as string,
      },
    });
    console.log(existingUser);
    if (existingUser) {
      throw new Error('User already exists!!');
    }

    console.log('***** Creating Admin User *****');

    //# Another way: without needing Origin allowance
    // const signUpAdmin = await auth.api.signUpEmail({
    //   body: adminData,
    // });

    // console.log(signUpAdmin);

    // if (signUpAdmin) {
    //   console.log('***** Success: Admin Created *****');
    // } else {
    //   throw new Error('Admin Creation Failed');
    // }

    const signUpAdmin = await fetch(
      `${process.env.BACKEND_URL}/api/auth/sign-up/email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: `${process.env.APP_URL}`,
        },
        body: JSON.stringify(adminData),
      },
    );

    if (signUpAdmin.ok) {
      console.log('***** Success: Admin Created *****');
    }
    console.log('***** END PROCESS *****');
  } catch (error) {
    console.error({ error });
  }
}

seedAdmin();

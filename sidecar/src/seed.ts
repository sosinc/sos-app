/**
 * @fileOverview
 *
 * Bootstrap initial data required to enter the SoS app. Following data is
 * created:
 * 1. Admin users - From emails extracted from environment
 */

import { User } from "./entity/User.entity";

const createAdminUsers = async () => {
  const adminEmails = (process.env.SOS_ADMIN_EMAILS || "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  if (!adminEmails.length) {
    return;
  }

  const userRepo = User.getRepository();
  const admins = adminEmails.map(email => {
    const user = new User();
    user.email = email;
    user.name = "Admin";
    user.role_id = "APP_ADMIN";

    return user;
  });

  return userRepo.createQueryBuilder().insert().values(admins).onConflict("DO NOTHING").execute();
};

export default async () => {
  return createAdminUsers();
};

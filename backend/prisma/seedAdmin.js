import prisma from "./client.js";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const email = "admin@labtrack.com";
  const password = "admin123";

  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      role: "ADMIN",
      fullName: "System Admin"
    }
  });

  console.log("Admin user created successfully");
}

seedAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

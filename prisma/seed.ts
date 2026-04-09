import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@luftpump.se" },
    update: {},
    create: {
      email: "admin@luftpump.se",
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user: ${admin.email} / password: admin123!`);

  // Create sample leads
  const lead1 = await prisma.lead.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Anna Karlsson",
      phone: "+46 70 111 22 33",
      email: "anna.karlsson@example.se",
      address: "Storgatan 12, 111 51 Stockholm",
      houseSize: 140,
      floors: 2,
      heatingSystem: "Direktverkande el",
      message: "Intresserad av Daikin eller Mitsubishi",
      status: "NEW",
    },
  });

  const lead2 = await prisma.lead.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Erik Lindqvist",
      phone: "+46 73 444 55 66",
      email: "erik.lindqvist@example.se",
      address: "Villagatan 5, 41102 Göteborg",
      houseSize: 180,
      floors: 2,
      heatingSystem: "Oljepanna",
      message: "Vill byta från olja till luftvärmepump",
      status: "CONTACTED",
    },
  });

  console.log(`✅ Sample leads created`);

  // Create a sample customer
  const customer = await prisma.customer.upsert({
    where: { email: "maria.svensson@example.se" },
    update: {},
    create: {
      name: "Maria Svensson",
      phone: "+46 72 777 88 99",
      email: "maria.svensson@example.se",
      address: "Parkgatan 8, 211 20 Malmö",
      notes: "Nöjd kund, installerade Panasonic i mars. Önskar årsservice.",
    },
  });
  console.log(`✅ Sample customer: ${customer.name}`);

  // Create a booking for lead1
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 3);

  await prisma.booking.upsert({
    where: { id: 1 },
    update: {},
    create: {
      leadId: lead1.id,
      date: tomorrow,
      time: "10:00",
      type: "CONSULTATION",
      notes: "Kunden föredrar morgontider",
    },
  });
  console.log(`✅ Sample booking created`);

  // Create a job for the customer
  const jobDate = new Date();
  jobDate.setDate(jobDate.getDate() + 7);

  await prisma.job.upsert({
    where: { id: 1 },
    update: {},
    create: {
      customerId: customer.id,
      technician: "Marcus Nilsson",
      status: "PENDING",
      scheduledDate: jobDate,
      notes: "Panasonic CS-Z35ZKEW, 2:a våning höger sida",
    },
  });
  console.log(`✅ Sample job created`);

  console.log("\n🎉 Seed complete!\n");
  console.log("Admin login:");
  console.log("  Email:    admin@luftpump.se");
  console.log("  Password: admin123!\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

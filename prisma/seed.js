const { PrismaClient, Role, Status } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

// --- Your custom hashing logic using crypto ---
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  try {
    console.log("Starting database seeding...");

    // Create admin user
    const adminPassword = await hashPassword("Admin@12345");
    const admin = await prisma.user.upsert({
      where: { email: "admin@healthsystem.com" },
      update: { password: adminPassword },
      create: {
        email: "admin@healthsystem.com",
        name: "System Administrator",
        password: adminPassword,
        telephone: "+250781234567",
        gender: "male",
        role: Role.ADMIN,
        active: true,
      },
    });

    console.log("✅ Admin user created:", admin.email);

    // Create sample CHW users
    const chwPassword = await hashPassword("CHW@12345");
    
    const chw1 = await prisma.user.upsert({
      where: { email: "chw1@healthsystem.com" },
      update: { password: chwPassword },
      create: {
        email: "chw1@healthsystem.com",
        name: "Marie Uwimana",
        password: chwPassword,
        telephone: "+250782345678",
        gender: "female",
        role: Role.CHW,
        active: true,
      },
    });

    const chw2 = await prisma.user.upsert({
      where: { email: "chw2@healthsystem.com" },
      update: { password: chwPassword },
      create: {
        email: "chw2@healthsystem.com",
        name: "Jean Baptiste Niyomugabo",
        password: chwPassword,
        telephone: "+250783456789",
        gender: "male",
        role: Role.CHW,
        active: true,
      },
    });

    console.log("✅ CHW users created:", chw1.email, chw2.email);

    // Create sample health reports
    const healthReport1 = await prisma.healthReport.create({
      data: {
        title: "Malaria Outbreak Alert",
        description: "Increased cases of malaria reported in Nyarugenge sector. Immediate intervention needed for vector control and community education.",
        location: "Nyarugenge Sector, Kigali",
        status: Status.PENDING,
        userId: chw1.id,
      },
    });

    const healthReport2 = await prisma.healthReport.create({
      data: {
        title: "Clean Water Access Issue",
        description: "Water source contamination reported in rural area. Multiple families affected, immediate water testing and alternative source needed.",
        location: "Gasabo District, Rural Area",
        status: Status.REVIEWED,
        userId: chw2.id,
      },
    });

    const healthReport3 = await prisma.healthReport.create({
      data: {
        title: "Vaccination Campaign Success",
        description: "Monthly vaccination campaign completed successfully. 95% coverage achieved in target population.",
        location: "Kicukiro District",
        status: Status.RESOLVED,
        userId: chw1.id,
      },
    });

    console.log("✅ Health reports created:", healthReport1.id, healthReport2.id, healthReport3.id);

    // Create sample patient visits
    const patientVisit1 = await prisma.patientVisit.create({
      data: {
        patientName: "Uwimana Grace",
        patientAge: 28,
        symptoms: "Fever, headache, body aches, fatigue",
        diagnosis: "Suspected malaria",
        treatment: "Artemether-lumefantrine, paracetamol for fever",
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        location: "Nyarugenge Health Center",
        userId: chw1.id,
      },
    });

    const patientVisit2 = await prisma.patientVisit.create({
      data: {
        patientName: "Muhire Eric",
        patientAge: 45,
        symptoms: "Persistent cough, chest pain, difficulty breathing",
        diagnosis: "Respiratory tract infection",
        treatment: "Antibiotics prescribed, rest recommended",
        followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        location: "Gasabo Health Post",
        userId: chw2.id,
      },
    });

    const patientVisit3 = await prisma.patientVisit.create({
      data: {
        patientName: "Mukamana Jeanne",
        patientAge: 35,
        symptoms: "Prenatal checkup",
        diagnosis: "Normal pregnancy progression",
        treatment: "Prenatal vitamins, iron supplements",
        followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        location: "Kicukiro Maternal Health Clinic",
        userId: chw1.id,
      },
    });

    const patientVisit4 = await prisma.patientVisit.create({
      data: {
        patientName: "Nzeyimana David",
        patientAge: 8,
        symptoms: "Routine child health checkup",
        diagnosis: "Healthy development",
        treatment: "Routine vaccinations administered",
        location: "Community Health Center",
        userId: chw2.id,
      },
    });

    console.log("✅ Patient visits created:", patientVisit1.id, patientVisit2.id, patientVisit3.id, patientVisit4.id);

    console.log("🎉 Database seeding completed successfully!");

  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
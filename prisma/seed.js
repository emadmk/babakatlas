const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.installationRate.deleteMany();
  await prisma.shippingRate.deleteMany();
  await prisma.carModel.deleteMany();
  await prisma.tintProduct.deleteMany();

  // Seed Tint Products
  const tintProducts = [
    {
      name: "Standard Tint",
      nameEn: "Standard Tint",
      nameTl: "Karaniwang Tint",
      description: "Reliable dyed film with solid UV protection and classic appearance.",
      descEn: "Reliable dyed film with solid UV protection and classic appearance.",
      descTl: "Maaasahang pelikulang tinina na may matibay na proteksyon sa UV.",
      tintType: "STANDARD",
      vlt: 35,
      uvBlock: 95,
      heatReject: 35,
      pricePerSqFt: 3.0,
      image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=200&fit=crop",
      active: true,
    },
    {
      name: "Ceramic Tint",
      nameEn: "Ceramic Tint",
      nameTl: "Seramikong Tint",
      description: "Nano-ceramic technology for maximum clarity and superior heat rejection.",
      descEn: "Nano-ceramic technology for maximum clarity and superior heat rejection.",
      descTl: "Nano-ceramic na teknolohiya para sa pinakamataas na kalinawan.",
      tintType: "CERAMIC",
      vlt: 20,
      uvBlock: 99,
      heatReject: 60,
      pricePerSqFt: 8.0,
      image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=200&fit=crop",
      active: true,
    },
    {
      name: "Carbon Tint",
      nameEn: "Carbon Tint",
      nameTl: "Carbon na Tint",
      description: "Carbon-infused film with no signal interference and matte finish.",
      descEn: "Carbon-infused film with no signal interference and matte finish.",
      descTl: "Pelikulang may halong carbon na walang signal interference.",
      tintType: "CARBON",
      vlt: 25,
      uvBlock: 99,
      heatReject: 50,
      pricePerSqFt: 6.0,
      image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=200&fit=crop",
      active: true,
    },
    {
      name: "Adaptive Tint",
      nameEn: "Adaptive Tint",
      nameTl: "Adaptive na Tint",
      description: "Smart film that automatically adjusts tint based on light conditions.",
      descEn: "Smart film that automatically adjusts tint based on light conditions.",
      descTl: "Matalinong pelikula na awtomatikong nag-aayos ng tint.",
      tintType: "ADAPTIVE",
      vlt: 50,
      uvBlock: 99,
      heatReject: 65,
      pricePerSqFt: 12.0,
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=200&fit=crop",
      active: true,
    },
    {
      name: "Crystalline Tint",
      nameEn: "Crystalline Tint",
      nameTl: "Kristalino na Tint",
      description: "Multi-layer optical film that keeps your windows virtually clear.",
      descEn: "Multi-layer optical film that keeps your windows virtually clear.",
      descTl: "Multi-layer na optical na pelikula na nagpapanatiling malinaw ang mga bintana.",
      tintType: "CRYSTALLINE",
      vlt: 40,
      uvBlock: 99,
      heatReject: 60,
      pricePerSqFt: 10.0,
      image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=200&fit=crop",
      active: true,
    },
    {
      name: "Metallic Tint",
      nameEn: "Metallic Tint",
      nameTl: "Metalikong Tint",
      description: "Reflective metallic particles for enhanced heat rejection and privacy.",
      descEn: "Reflective metallic particles for enhanced heat rejection and privacy.",
      descTl: "Mga reflective metallic particle para sa pinahusay na pagtanggi sa init.",
      tintType: "METALLIC",
      vlt: 15,
      uvBlock: 97,
      heatReject: 45,
      pricePerSqFt: 5.0,
      image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=200&fit=crop",
      active: true,
    },
  ];

  for (const product of tintProducts) {
    await prisma.tintProduct.create({ data: product });
  }
  console.log(`Seeded ${tintProducts.length} tint products`);

  // Seed Car Models
  const carModels = [
    { name: "Sedan", carType: "SEDAN", windowCount: 6, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop" },
    { name: "SUV", carType: "SUV", windowCount: 8, image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop" },
    { name: "Van", carType: "VAN", windowCount: 8, image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=250&fit=crop" },
    { name: "Station Wagon", carType: "STATION_WAGON", windowCount: 8, image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop" },
    { name: "Hatchback", carType: "HATCHBACK", windowCount: 6, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop" },
    { name: "Coupe", carType: "COUPE", windowCount: 4, image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop" },
    { name: "Truck", carType: "TRUCK", windowCount: 4, image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&h=250&fit=crop" },
    { name: "Convertible", carType: "CONVERTIBLE", windowCount: 4, image: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=400&h=250&fit=crop" },
  ];

  for (const car of carModels) {
    await prisma.carModel.create({ data: car });
  }
  console.log(`Seeded ${carModels.length} car models`);

  // Seed Shipping Rates
  const shippingRates = [
    { country: "PH", region: "Philippines", baseRate: 15.0, perKgRate: 2.0, freeAbove: 200.0, active: true },
    { country: "AU", region: "Australia", baseRate: 25.0, perKgRate: 3.0, freeAbove: 300.0, active: true },
  ];

  for (const rate of shippingRates) {
    await prisma.shippingRate.create({ data: rate });
  }
  console.log(`Seeded ${shippingRates.length} shipping rates`);

  // Seed Installation Rates
  const installationRates = [
    { country: "PH", carType: "SEDAN", baseRate: 80.0, perWindow: 15.0, active: true },
    { country: "PH", carType: "SUV", baseRate: 100.0, perWindow: 18.0, active: true },
    { country: "PH", carType: "VAN", baseRate: 120.0, perWindow: 20.0, active: true },
    { country: "PH", carType: "HATCHBACK", baseRate: 75.0, perWindow: 14.0, active: true },
    { country: "PH", carType: "COUPE", baseRate: 70.0, perWindow: 14.0, active: true },
    { country: "PH", carType: "TRUCK", baseRate: 90.0, perWindow: 16.0, active: true },
    { country: "AU", carType: "SEDAN", baseRate: 100.0, perWindow: 20.0, active: true },
    { country: "AU", carType: "SUV", baseRate: 130.0, perWindow: 25.0, active: true },
    { country: "AU", carType: "VAN", baseRate: 150.0, perWindow: 28.0, active: true },
    { country: "AU", carType: "HATCHBACK", baseRate: 95.0, perWindow: 18.0, active: true },
    { country: "AU", carType: "COUPE", baseRate: 90.0, perWindow: 18.0, active: true },
    { country: "AU", carType: "TRUCK", baseRate: 110.0, perWindow: 22.0, active: true },
  ];

  for (const rate of installationRates) {
    await prisma.installationRate.create({ data: rate });
  }
  console.log(`Seeded ${installationRates.length} installation rates`);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Tint Products
  const tintProducts = [
    {
      name: "Standard Tint",
      nameEn: "Standard Tint",
      nameTl: "Standard na Tint",
      description: "Reliable dyed film offering basic heat and glare reduction",
      descEn: "Reliable dyed film offering basic heat and glare reduction",
      descTl: "Maaasahang dyed film na nag-aalok ng basic na pagbabawas ng init at glare",
      tintType: "STANDARD",
      vlt: 35,
      uvBlock: 95,
      heatReject: 35,
      pricePerSqFt: 3.0,
      active: true,
    },
    {
      name: "Ceramic Tint",
      nameEn: "Ceramic Tint",
      nameTl: "Ceramic na Tint",
      description: "Premium nano-ceramic technology with superior heat rejection",
      descEn: "Premium nano-ceramic technology with superior heat rejection",
      descTl: "Premium na nano-ceramic technology na may superior na pagbabawas ng init",
      tintType: "CERAMIC",
      vlt: 20,
      uvBlock: 99,
      heatReject: 60,
      pricePerSqFt: 8.0,
      active: true,
    },
    {
      name: "Carbon Tint",
      nameEn: "Carbon Tint",
      nameTl: "Carbon na Tint",
      description: "Carbon particle film with excellent UV protection",
      descEn: "Carbon particle film with excellent UV protection",
      descTl: "Carbon particle film na may mahusay na UV protection",
      tintType: "CARBON",
      vlt: 25,
      uvBlock: 99,
      heatReject: 50,
      pricePerSqFt: 6.0,
      active: true,
    },
    {
      name: "Adaptive Tint",
      nameEn: "Adaptive Tint",
      nameTl: "Adaptive na Tint",
      description: "Smart photochromic film that automatically adjusts to light conditions",
      descEn: "Smart photochromic film that automatically adjusts to light conditions",
      descTl: "Smart photochromic film na awtomatikong nag-a-adjust sa liwanag",
      tintType: "ADAPTIVE",
      vlt: 50,
      uvBlock: 99,
      heatReject: 65,
      pricePerSqFt: 12.0,
      active: true,
    },
    {
      name: "Crystalline Tint",
      nameEn: "Crystalline Tint",
      nameTl: "Crystalline na Tint",
      description: "Near-invisible film that blocks heat without darkening windows",
      descEn: "Near-invisible film that blocks heat without darkening windows",
      descTl: "Halos hindi nakikitang film na humaharang sa init nang hindi nagdidilim ng bintana",
      tintType: "CRYSTALLINE",
      vlt: 40,
      uvBlock: 99,
      heatReject: 60,
      pricePerSqFt: 10.0,
      active: true,
    },
    {
      name: "Metallic Tint",
      nameEn: "Metallic Tint",
      nameTl: "Metallic na Tint",
      description: "Metal-infused film offering strong heat rejection with a reflective finish",
      descEn: "Metal-infused film offering strong heat rejection with a reflective finish",
      descTl: "Metal-infused film na nag-aalok ng matinding pagbabawas ng init na may reflective finish",
      tintType: "METALLIC",
      vlt: 15,
      uvBlock: 97,
      heatReject: 45,
      pricePerSqFt: 5.0,
      active: true,
    },
  ];

  for (const product of tintProducts) {
    await prisma.tintProduct.upsert({
      where: { name: product.name },
      update: product,
      create: product,
    });
  }

  // Seed Car Models
  const carModels = [
    { name: "Sedan", carType: "SEDAN", windowCount: 6 },
    { name: "SUV", carType: "SUV", windowCount: 8 },
    { name: "Van", carType: "VAN", windowCount: 8 },
    { name: "Station Wagon", carType: "STATION_WAGON", windowCount: 6 },
    { name: "Hatchback", carType: "HATCHBACK", windowCount: 6 },
    { name: "Coupe", carType: "COUPE", windowCount: 4 },
    { name: "Truck", carType: "TRUCK", windowCount: 4 },
    { name: "Convertible", carType: "CONVERTIBLE", windowCount: 4 },
  ];

  for (const car of carModels) {
    await prisma.carModel.upsert({
      where: { name: car.name },
      update: car,
      create: car,
    });
  }

  // Seed Shipping Rates
  const shippingRates = [
    { country: "PH", region: "Philippines", baseRate: 15, perKgRate: 2, freeAbove: 200, active: true },
    { country: "AU", region: "Australia", baseRate: 25, perKgRate: 3, freeAbove: 300, active: true },
  ];

  for (const rate of shippingRates) {
    await prisma.shippingRate.create({ data: rate });
  }

  // Seed Installation Rates
  const installationRates = [
    { country: "PH", carType: "SEDAN", baseRate: 80, perWindow: 15, active: true },
    { country: "PH", carType: "SUV", baseRate: 100, perWindow: 18, active: true },
    { country: "PH", carType: "VAN", baseRate: 120, perWindow: 20, active: true },
    { country: "PH", carType: "HATCHBACK", baseRate: 75, perWindow: 14, active: true },
    { country: "PH", carType: "COUPE", baseRate: 70, perWindow: 14, active: true },
    { country: "PH", carType: "TRUCK", baseRate: 90, perWindow: 16, active: true },
    { country: "AU", carType: "SEDAN", baseRate: 100, perWindow: 20, active: true },
    { country: "AU", carType: "SUV", baseRate: 130, perWindow: 25, active: true },
    { country: "AU", carType: "VAN", baseRate: 150, perWindow: 28, active: true },
    { country: "AU", carType: "HATCHBACK", baseRate: 95, perWindow: 18, active: true },
    { country: "AU", carType: "COUPE", baseRate: 90, perWindow: 18, active: true },
    { country: "AU", carType: "TRUCK", baseRate: 110, perWindow: 22, active: true },
  ];

  for (const rate of installationRates) {
    await prisma.installationRate.create({ data: rate });
  }

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

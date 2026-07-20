import { PrismaClient } from "@prisma/client";

import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.rewardEvent.deleteMany();
  await prisma.packagingOption.deleteMany();
  await prisma.surplusListing.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.wasteSnapshot.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        name: "Marina Pantry",
        email: "business@wasteless.sg",
        passwordHash: hashPassword("business123"),
        role: "business",
      },
      {
        name: "Alicia Tan",
        email: "customer@wasteless.sg",
        passwordHash: hashPassword("customer123"),
        role: "customer",
      },
    ],
  });

  await prisma.ingredient.createMany({
    data: [
      {
        name: "Jasmine rice",
        category: "Staples",
        stockLevel: 18,
        unit: "kg",
        dailyUsage: 6.5,
        forecastTomorrow: 7.8,
        reorderPoint: 14,
        expiryDays: 24,
        supplier: "Tiong Bahru Pantry Co.",
        trend: "Hawker lunch spike",
      },
      {
        name: "Chicken breast",
        category: "Protein",
        stockLevel: 10,
        unit: "kg",
        dailyUsage: 5.2,
        forecastTomorrow: 6.4,
        reorderPoint: 12,
        expiryDays: 2,
        supplier: "Jurong Fresh Foods",
        trend: "Fri dinner uplift",
      },
      {
        name: "Coconut milk",
        category: "Sauces",
        stockLevel: 14,
        unit: "L",
        dailyUsage: 2.3,
        forecastTomorrow: 2.8,
        reorderPoint: 6,
        expiryDays: 5,
        supplier: "Green Cart SG",
        trend: "Stable",
      },
      {
        name: "Mixed greens",
        category: "Produce",
        stockLevel: 4,
        unit: "kg",
        dailyUsage: 2.2,
        forecastTomorrow: 3.1,
        reorderPoint: 5,
        expiryDays: 1,
        supplier: "Pasir Panjang Harvest",
        trend: "Dinner promo effect",
      },
    ],
  });

  await prisma.surplusListing.createMany({
    data: [
      {
        title: "Teriyaki rice bowls",
        cuisine: "Japanese",
        neighbourhood: "Bugis",
        pickupStart: "7:30 PM",
        pickupEnd: "8:30 PM",
        originalPrice: 9.9,
        discountedPrice: 5.9,
        portionsRemaining: 6,
        reservedCount: 9,
        carbonSavedKg: 11.4,
        status: "active",
      },
      {
        title: "Laksa family set",
        cuisine: "Peranakan",
        neighbourhood: "Kallang",
        pickupStart: "8:00 PM",
        pickupEnd: "9:00 PM",
        originalPrice: 18,
        discountedPrice: 10.8,
        portionsRemaining: 3,
        reservedCount: 5,
        carbonSavedKg: 8.2,
        status: "active",
      },
      {
        title: "Cold brew and bakes bundle",
        cuisine: "Cafe",
        neighbourhood: "Tiong Bahru",
        pickupStart: "6:45 PM",
        pickupEnd: "7:30 PM",
        originalPrice: 14.5,
        discountedPrice: 8.5,
        portionsRemaining: 5,
        reservedCount: 7,
        carbonSavedKg: 6.8,
        status: "active",
      },
    ],
  });

  await prisma.packagingOption.createMany({
    data: [
      {
        menuType: "Rice bowls",
        currentMaterial: "PP takeaway box",
        suggestedMaterial: "Bagasse clamshell with corn lid",
        supplier: "EcoPax Singapore",
        carbonReductionPct: 31,
        costDelta: 0.08,
        notes: "Heat-safe and stackable for delivery riders.",
      },
      {
        menuType: "Soups and curries",
        currentMaterial: "PET bowl",
        suggestedMaterial: "Plant-fibre soup tub",
        supplier: "BioPak SEA",
        carbonReductionPct: 27,
        costDelta: 0.11,
        notes: "Works for high-temperature gravies with a tighter seal.",
      },
      {
        menuType: "Bakery items",
        currentMaterial: "Plastic sleeve",
        suggestedMaterial: "Kraft paper wrap",
        supplier: "The Better Packaging Co.",
        carbonReductionPct: 42,
        costDelta: -0.03,
        notes: "Cheaper for single pastries and visually stronger on shelf.",
      },
    ],
  });

  await prisma.rewardEvent.createMany({
    data: [
      {
        title: "BYO container bonus",
        description: "Customers earned 30 points for container returns at the dinner rush.",
        points: 30,
        channel: "Loyalty",
      },
      {
        title: "Surplus meal rescued",
        description: "A marketplace order prevented one teriyaki bowl set from being discarded.",
        points: 20,
        channel: "Marketplace",
      },
      {
        title: "Five-green-streak reward",
        description: "Repeat buyers unlocked a reusable-cutlery perk.",
        points: 50,
        channel: "Milestone",
      },
    ],
  });

  await prisma.wasteSnapshot.createMany({
    data: [
      {
        label: "Week 1",
        capturedAt: new Date("2026-06-22T09:00:00.000Z"),
        foodWasteKg: 42,
        packagingWasteKg: 18,
        surplusSoldMeals: 21,
        containersReturned: 9,
      },
      {
        label: "Week 2",
        capturedAt: new Date("2026-06-29T09:00:00.000Z"),
        foodWasteKg: 35,
        packagingWasteKg: 15,
        surplusSoldMeals: 27,
        containersReturned: 13,
      },
      {
        label: "Week 3",
        capturedAt: new Date("2026-07-06T09:00:00.000Z"),
        foodWasteKg: 28,
        packagingWasteKg: 12,
        surplusSoldMeals: 34,
        containersReturned: 18,
      },
      {
        label: "Week 4",
        capturedAt: new Date("2026-07-13T09:00:00.000Z"),
        foodWasteKg: 24,
        packagingWasteKg: 10,
        surplusSoldMeals: 39,
        containersReturned: 24,
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
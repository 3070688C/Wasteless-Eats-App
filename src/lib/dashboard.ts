import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const [ingredients, listings, packaging, rewards, snapshots] = await Promise.all([
    prisma.ingredient.findMany({ orderBy: [{ expiryDays: "asc" }, { stockLevel: "asc" }] }),
    prisma.surplusListing.findMany({ orderBy: [{ status: "asc" }, { discountedPrice: "asc" }] }),
    prisma.packagingOption.findMany({ orderBy: { carbonReductionPct: "desc" } }),
    prisma.rewardEvent.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.wasteSnapshot.findMany({ orderBy: { capturedAt: "asc" } }),
  ]);

  const totalFoodWaste = snapshots.reduce((sum, item) => sum + item.foodWasteKg, 0);
  const totalPackagingWaste = snapshots.reduce((sum, item) => sum + item.packagingWasteKg, 0);
  const surplusSoldMeals = snapshots.reduce((sum, item) => sum + item.surplusSoldMeals, 0);
  const containersReturned = snapshots.reduce((sum, item) => sum + item.containersReturned, 0);
  const totalRewardPoints = rewards.reduce((sum, item) => sum + item.points, 0);
  const activeListings = listings.filter((item) => item.status === "active");
  const inventoryAlerts = ingredients.filter(
    (item) => item.stockLevel <= item.reorderPoint || item.expiryDays <= 2,
  );
  const projectedRecoveredRevenue = activeListings.reduce(
    (sum, item) => sum + item.discountedPrice * item.portionsRemaining,
    0,
  );
  const latestSnapshot = snapshots.at(-1);
  const baselineSnapshot = snapshots[0];
  const foodWasteReductionPct = baselineSnapshot
    ? Math.round(
        ((baselineSnapshot.foodWasteKg - (latestSnapshot?.foodWasteKg ?? baselineSnapshot.foodWasteKg)) /
          baselineSnapshot.foodWasteKg) *
          100,
      )
    : 0;

  return {
    ingredients,
    listings,
    packaging,
    rewards,
    snapshots,
    summary: {
      totalFoodWaste,
      totalPackagingWaste,
      surplusSoldMeals,
      containersReturned,
      totalRewardPoints,
      activeListings: activeListings.length,
      inventoryAlerts: inventoryAlerts.length,
      projectedRecoveredRevenue,
      foodWasteReductionPct,
      latestFoodWasteKg: latestSnapshot?.foodWasteKg ?? 0,
      latestPackagingWasteKg: latestSnapshot?.packagingWasteKg ?? 0,
    },
  };
}

export async function reserveListing(id: string) {
  await prisma.$transaction(async (tx) => {
    const listing = await tx.surplusListing.findUnique({ where: { id } });

    if (!listing || listing.status !== "active" || listing.portionsRemaining <= 0) {
      return;
    }

    const nextPortions = listing.portionsRemaining - 1;

    await tx.surplusListing.update({
      where: { id },
      data: {
        portionsRemaining: nextPortions,
        reservedCount: { increment: 1 },
        status: nextPortions === 0 ? "sold_out" : "active",
      },
    });

    await tx.rewardEvent.create({
      data: {
        title: "Surplus meal rescued",
        description: `One portion of ${listing.title} was reserved before closing time.`,
        points: 20,
        channel: "Marketplace",
      },
    });
  });
}

export async function logCustomerPackagingChoice(option: string) {
  const points = option === "BYO container" ? 30 : option === "Reusable deposit box" ? 24 : 12;

  await prisma.rewardEvent.create({
    data: {
      title: "Checkout packaging choice",
      description: `Customer selected ${option} for a marketplace order.`,
      points,
      channel: "Packaging",
    },
  });
}

export async function logContainerReturn() {
  await prisma.$transaction(async (tx) => {
    const latestSnapshot = await tx.wasteSnapshot.findFirst({
      orderBy: { capturedAt: "desc" },
    });

    await tx.rewardEvent.create({
      data: {
        title: "BYO container bonus",
        description: "A customer brought their own container and earned 30 points.",
        points: 30,
        channel: "Loyalty",
      },
    });

    if (latestSnapshot) {
      await tx.wasteSnapshot.update({
        where: { id: latestSnapshot.id },
        data: {
          containersReturned: { increment: 1 },
          packagingWasteKg: Math.max(0, Number((latestSnapshot.packagingWasteKg - 0.2).toFixed(1))),
        },
      });
    }
  });
}
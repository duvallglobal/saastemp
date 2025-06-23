import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import schema, {
  CURRENCIES,
  INTERVALS,
  PLANS,
  ROLES,
  ONBOARDING_STATUS,
} from "./schema";

// Import stripe if you have it configured
// import { stripe } from "./stripe"; // Uncomment if you have stripe configured

// Define errors if not imported from elsewhere
const ERRORS = {
  STRIPE_SOMETHING_WENT_WRONG: "Something went wrong with Stripe",
};

const seedProducts = [
  {
    key: PLANS.FREE,
    name: "Free",
    description: "Start with the basics, upgrade anytime.",
    prices: {
      [INTERVALS.MONTH]: {
        [CURRENCIES.USD]: 0,
        [CURRENCIES.EUR]: 0,
      },
      [INTERVALS.YEAR]: {
        [CURRENCIES.USD]: 0,
        [CURRENCIES.EUR]: 0,
      },
    },
  },
  {
    key: PLANS.PRO,
    name: "Pro",
    description: "Access to all features and unlimited projects.",
    prices: {
      [INTERVALS.MONTH]: {
        [CURRENCIES.USD]: 1990,
        [CURRENCIES.EUR]: 1990,
      },
      [INTERVALS.YEAR]: {
        [CURRENCIES.USD]: 19990,
        [CURRENCIES.EUR]: 19990,
      },
    },
  },
];

export const insertSeedPlan = internalMutation({
  args: schema.tables.plans.validator,
  handler: async (ctx, args) => {
    await ctx.db.insert("plans", {
      stripeId: args.stripeId,
      key: args.key,
      name: args.name,
      description: args.description,
      prices: args.prices,
    });
  },
});

export const init = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Create the free plan
    const existingFreePlan = await ctx.db
      .query("plans")
      .withIndex("key", (q) => q.eq("key", PLANS.FREE))
      .unique();

    if (!existingFreePlan) {
      await ctx.db.insert("plans", {
        key: PLANS.FREE,
        stripeId: "free",
        name: "Free",
        description: "Free plan with basic features",
        prices: {
          month: {
            usd: {
              stripeId: "free-usd-month",
              amount: 0,
            },
            eur: {
              stripeId: "free-eur-month",
              amount: 0,
            },
          },
          year: {
            usd: {
              stripeId: "free-usd-year",
              amount: 0,
            },
            eur: {
              stripeId: "free-eur-year",
              amount: 0,
            },
          },
        },
      });
      console.log("✅ Free plan created");
    }

    // Create the pro plan
    const existingProPlan = await ctx.db
      .query("plans")
      .withIndex("key", (q) => q.eq("key", PLANS.PRO))
      .unique();

    if (!existingProPlan) {
      await ctx.db.insert("plans", {
        key: PLANS.PRO,
        stripeId: "pro",
        name: "Pro",
        description: "Pro plan with advanced features",
        prices: {
          month: {
            usd: {
              stripeId: "pro-usd-month",
              amount: 2990, // $29.90
            },
            eur: {
              stripeId: "pro-eur-month",
              amount: 2990, // €29.90
            },
          },
          year: {
            usd: {
              stripeId: "pro-usd-year",
              amount: 29990, // $299.90
            },
            eur: {
              stripeId: "pro-eur-year",
              amount: 29990, // €299.90
            },
          },
        },
      });
      console.log("✅ Pro plan created");
    }

    // Check if any admin users exist
    const existingAdmin = await ctx.db
      .query("users")
      .withIndex("role", (q) => q.eq("role", ROLES.ADMIN))
      .first();

    if (!existingAdmin) {
      console.log("⚠️  No admin user found. Please create one through the authentication flow and then use createFirstAdmin.");
    } else {
      console.log("✅ Admin user exists");
    }

    console.log("🎉 Database initialization completed");
  },
});

export const createFirstAdmin = internalMutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the user by email
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      throw new Error(`User with email ${args.email} not found`);
    }

    // Set the user as admin
    await ctx.db.patch(user._id, {
      role: ROLES.ADMIN,
      onboardingStatus: ONBOARDING_STATUS.APPROVED,
    });

    console.log(`✅ User ${args.email} has been set as admin`);
    return { success: true, userId: user._id };
  },
});

export const createTestData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // This function can be used to create test data for development
    console.log("Creating test data...");

    // You can add test users, appointments, etc. here for development
    // Example:
    /*
    const testClient = await ctx.db.insert("users", {
      name: "Test Client",
      email: "client@test.com",
      role: ROLES.CLIENT,
      onboardingStatus: ONBOARDING_STATUS.COMPLETED,
      serviceType: "onlyfans",
    });
    */

    console.log("✅ Test data creation completed");
  },
});

export const resetDatabase = internalMutation({
  args: {
    confirmReset: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (!args.confirmReset) {
      throw new Error("Reset not confirmed");
    }

    // Delete all data (use with caution!)
    const tables = ["appointments", "clientProfiles", "content", "subscriptions"];

    for (const tableName of tables) {
      const records = await ctx.db.query(tableName as any).collect();
      for (const record of records) {
        await ctx.db.delete(record._id);
      }
      console.log(`🗑️  Cleared ${tableName} table`);
    }

    // Reset all users to remove roles (except keep one admin)
    const users = await ctx.db.query("users").collect();
    const adminUsers = users.filter(u => u.role === ROLES.ADMIN);

    for (const user of users) {
      if (user.role && adminUsers.length > 1 && user.role === ROLES.ADMIN) {
        // Keep at least one admin
        continue;
      }
      await ctx.db.patch(user._id, {
        role: undefined,
        onboardingStatus: undefined,
        serviceType: undefined,
      });
    }

    console.log("🔄 Database reset completed");
  },
});

// Stripe integration (uncomment and modify if you have Stripe configured)
/*
export default internalAction(async (ctx) => {
  // Check if Stripe products already exist
  const products = await stripe.products.list({
    limit: 1,
  });
  
  if (products?.data?.length) {
    console.info("🏃‍♂️ Skipping Stripe products creation and seeding.");
    return;
  }

  const seededProducts = await asyncMap(seedProducts, async (product) => {
    // Format prices to match Stripe's API
    const pricesByInterval = Object.entries(product.prices).flatMap(
      ([interval, price]) => {
        return Object.entries(price).map(([currency, amount]) => ({
          interval,
          currency,
          amount,
        }));
      },
    );

    // Create Stripe product
    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description,
    });

    // Create Stripe prices for the current product
    const stripePrices = await Promise.all(
      pricesByInterval.map((price) => {
        return stripe.prices.create({
          product: stripeProduct.id,
          currency: price.currency ?? "usd",
          unit_amount: price.amount ?? 0,
          tax_behavior: "inclusive",
          recurring: {
            interval: (price.interval as Interval) ?? INTERVALS.MONTH,
          },
        });
      }),
    );

    const getPrice = (currency: Currency, interval: Interval) => {
      const price = stripePrices.find(
        (price) =>
          price.currency === currency && price.recurring?.interval === interval,
      );
      if (!price) {
        throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
      }
      return { stripeId: price.id, amount: price.unit_amount || 0 };
    };

    await ctx.runMutation(internal.init.insertSeedPlan, {
      stripeId: stripeProduct.id,
      key: product.key as PlanKey,
      name: product.name,
      description: product.description,
      prices: {
        [INTERVALS.MONTH]: {
          [CURRENCIES.USD]: getPrice(CURRENCIES.USD, INTERVALS.MONTH),
          [CURRENCIES.EUR]: getPrice(CURRENCIES.EUR, INTERVALS.MONTH),
        },
        [INTERVALS.YEAR]: {
          [CURRENCIES.USD]: getPrice(CURRENCIES.USD, INTERVALS.YEAR),
          [CURRENCIES.EUR]: getPrice(CURRENCIES.EUR, INTERVALS.YEAR),
        },
      },
    });

    return {
      key: product.key,
      product: stripeProduct.id,
      prices: stripePrices.map((price) => price.id),
    };
  });

  console.info(`📦 Stripe Products has been successfully created.`);

  // Configure Customer Portal
  await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: "ManageTheFans - Customer Portal",
    },
    features: {
      customer_update: {
        enabled: true,
        allowed_updates: ["address", "shipping", "tax_id", "email"],
      },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: { enabled: true },
      subscription_update: {
        enabled: true,
        default_allowed_updates: ["price"],
        proration_behavior: "always_invoice",
        products: seededProducts
          .filter(({ key }) => key !== PLANS.FREE)
          .map(({ product, prices }) => ({ product, prices })),
      },
    },
  });

  console.info(`👒 Stripe Customer Portal has been successfully configured.`);
  console.info(
    "🎉 Visit: https://dashboard.stripe.com/test/products to see your products.",
  );
});
*/
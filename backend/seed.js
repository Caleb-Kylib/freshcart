const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const Product = require("./models/Product");

const products = [
  { name: "Fresh Mangoes (Ngowe)", category: "Fruits", price: 150, stock: 100, unit: "kg", description: "Sweet, juicy, and hand-picked Ngowe mangoes directly from Machakos.", image: "/products/mango.jpg" },
  { name: "Ripe Bananas", category: "Fruits", price: 120, stock: 100, unit: "bunch", description: "Naturally ripened sweet bananas, perfect for smoothies or snacking.", image: "/products/bananas.jpg" },
  { name: "Red Apples (Imported)", category: "Fruits", price: 350, stock: 80, unit: "kg", description: "Crisp and sweet red apples, full of flavor and freshness.", image: "/products/red-apple.jpg" },
  { name: "Hass Avocados", category: "Fruits", price: 80, stock: 150, unit: "piece", description: "Creamy Hass avocados, ready to eat. Great for salads and toast.", image: "/products/Avocado_Hass_-_single_and_halved.jpg" },
  { name: "Strawberries", category: "Fruits", price: 400, stock: 60, unit: "punnet", description: "Freshly picked tangy and sweet strawberries from Limuru.", image: "/products/strawberry.jpg" },
  { name: "Green Smoothie", category: "Smoothies", price: 450, stock: 50, unit: "500ml", description: "Detox green smoothie with spinach, apple, kale, and lemon.", image: "/products/smoothies.jpg" },
  { name: "Fresh Orange Juice", category: "Juices", price: 500, stock: 70, unit: "1L", description: "100% pure squeezed orange juice. No added sugar.", image: "/products/oranges.jpg" },
  { name: "Fresh Spinach", category: "Vegetables", price: 50, stock: 200, unit: "bunch", description: "Organic green spinach leaves, washed and ready to cook.", image: "/products/Spinach.jpg" },
  { name: "Tomatoes", category: "Vegetables", price: 150, stock: 200, unit: "kg", description: "Ripe red tomatoes, perfect for cooking stews and salads.", image: "/products/vegetables.jpg" },
  { name: "Carrots", category: "Vegetables", price: 100, stock: 180, unit: "kg", description: "Crunchy orange carrots, rich in Vitamin A.", image: "/products/carrots.jpg" },
  { name: "Fresh Mint", category: "Herbs", price: 40, stock: 120, unit: "bunch", description: "Aromatic fresh mint leaves for tea or garnish.", image: "/products/freshmint.jpg" },
  { name: "Coriander (Dhania)", category: "Herbs", price: 30, stock: 150, unit: "bunch", description: "Fresh coriander leaves to deliver that distinct flavor to your meals.", image: "/products/herbs.jpg" },
  { name: "Pineapple Mint Juice", category: "Juices", price: 450, stock: 60, unit: "500ml", description: "Refreshing pineapple juice with a hint of fresh mint.", image: "/products/pinacolada-smoothie.jpg" },
  { name: "Wild Berries Blast", category: "Juices", price: 550, stock: 50, unit: "500ml", description: "A blend of raspberries, blueberries, and strawberries.", image: "/products/wildberries.jpg" },
  { name: "Pure Mango Nectar", category: "Juices", price: 480, stock: 60, unit: "500ml", description: "Thick and sweet nectar made from ripe Ngowe mangoes.", image: "/products/mango-juice-featured-2.jpg" },
  { name: "Cold Pressed Watermelon", category: "Juices", price: 400, stock: 70, unit: "500ml", description: "Hydrating cold-pressed watermelon juice, perfect for hot days.", image: "/products/melon.jpg" },
  { name: "Passion Fruit Delight", category: "Juices", price: 450, stock: 65, unit: "500ml", description: "Tangy and aromatic fresh passion fruit juice.", image: "/products/passionjuice.jpg" },
  { name: "Apple & Ginger Zest", category: "Juices", price: 500, stock: 55, unit: "500ml", description: "Crisp apple juice with a spicy ginger kick.", image: "/products/gingershots.jpg" },
  { name: "Tropical Punch", category: "Juices", price: 520, stock: 60, unit: "500ml", description: "A vibrant mix of pineapple, passion, and orange juices.", image: "/products/juices.jpg" },
  { name: "Beetroot & Carrot Detox", category: "Juices", price: 500, stock: 55, unit: "500ml", description: "Healthy beet and carrot blend for a natural energy boost.", image: "/products/detox.jpg" },
  { name: "Deluxe Fruit Basket", category: "Lifestyle Bundles", price: 2500, stock: 20, unit: "basket", description: "A premium selection of seasonal fruits, beautifully presented.", image: "/products/fruit-basket.jpg" },
  { name: "Small Wellness Basket", category: "Lifestyle Bundles", price: 1500, stock: 30, unit: "basket", description: "Perfect for a healthy gift or weekly home supply.", image: "/products/grocery-box.jpg" },
];

const seedDB = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected!");

    const existing = await Product.countDocuments();
    if (existing > 0) {
      console.log(`ℹ️  Database already has ${existing} products.`);
      console.log("   Clearing and re-seeding...");
      await Product.deleteMany({});
    }

    const inserted = await Product.insertMany(products);
    console.log(`\n🌱 Successfully seeded ${inserted.length} products into MongoDB!`);
    console.log("\nSample product IDs:");
    inserted.slice(0, 3).forEach(p => console.log(`   ${p.name}: ${p._id}`));

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedDB();

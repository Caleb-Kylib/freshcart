const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const Product = require("./models/Product");

const products = [
  { name: "Fresh Mangoes (Ngowe)", category: "Fruits", price: 150, stock: 100, unit: "kg", description: "Sweet, juicy, and hand-picked Ngowe mangoes directly from Machakos.", image: "/products/mango.jpg" },
  { name: "Ripe Bananas", category: "Fruits", price: 120, stock: 100, unit: "bunch", description: "Naturally ripened sweet bananas, perfect for smoothies or snacking.", image: "/products/bananas.jpg" },
  { name: "Red Apples (Imported)", category: "Fruits", price: 350, stock: 80, unit: "kg", description: "Crisp and sweet red apples, full of flavor and freshness.", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=300&auto=format&fit=crop" },
  { name: "Hass Avocados", category: "Fruits", price: 80, stock: 150, unit: "piece", description: "Creamy Hass avocados, ready to eat. Great for salads and toast.", image: "/products/Avocado_Hass_-_single_and_halved.jpg" },
  { name: "Strawberries", category: "Fruits", price: 400, stock: 60, unit: "punnet", description: "Freshly picked tangy and sweet strawberries from Limuru.", image: "/products/strawberry.jpg" },
  { name: "Green Smoothie", category: "Smoothies", price: 450, stock: 50, unit: "500ml", description: "Detox green smoothie with spinach, apple, kale, and lemon.", image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=300&auto=format&fit=crop" },
  { name: "Fresh Orange Juice", category: "Juices", price: 500, stock: 70, unit: "1L", description: "100% pure squeezed orange juice. No added sugar.", image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=300&auto=format&fit=crop" },
  { name: "Fresh Spinach", category: "Vegetables", price: 50, stock: 200, unit: "bunch", description: "Organic green spinach leaves, washed and ready to cook.", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=300&auto=format&fit=crop" },
  { name: "Tomatoes", category: "Vegetables", price: 150, stock: 200, unit: "kg", description: "Ripe red tomatoes, perfect for cooking stews and salads.", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=300&auto=format&fit=crop" },
  { name: "Carrots", category: "Vegetables", price: 100, stock: 180, unit: "kg", description: "Crunchy orange carrots, rich in Vitamin A.", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=300&auto=format&fit=crop" },
  { name: "Fresh Mint", category: "Herbs", price: 40, stock: 120, unit: "bunch", description: "Aromatic fresh mint leaves for tea or garnish.", image: "/products/freshmint.jpg" },
  { name: "Coriander (Dhania)", category: "Herbs", price: 30, stock: 150, unit: "bunch", description: "Fresh coriander leaves to deliver that distinct flavor to your meals.", image: "https://images.unsplash.com/photo-1588879464627-c10ba12543e4?q=80&w=300&auto=format&fit=crop" },
  { name: "Pineapple Mint Juice", category: "Juices", price: 450, stock: 60, unit: "500ml", description: "Refreshing pineapple juice with a hint of fresh mint.", image: "https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=300&auto=format&fit=crop" },
  { name: "Wild Berries Blast", category: "Juices", price: 550, stock: 50, unit: "500ml", description: "A blend of raspberries, blueberries, and strawberries.", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=300&auto=format&fit=crop" },
  { name: "Pure Mango Nectar", category: "Juices", price: 480, stock: 60, unit: "500ml", description: "Thick and sweet nectar made from ripe Ngowe mangoes.", image: "https://images.unsplash.com/photo-1546173159-315724a93c90?q=80&w=300&auto=format&fit=crop" },
  { name: "Cold Pressed Watermelon", category: "Juices", price: 400, stock: 70, unit: "500ml", description: "Hydrating cold-pressed watermelon juice, perfect for hot days.", image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?q=80&w=300&auto=format&fit=crop" },
  { name: "Passion Fruit Delight", category: "Juices", price: 450, stock: 65, unit: "500ml", description: "Tangy and aromatic fresh passion fruit juice.", image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=300&auto=format&fit=crop" },
  { name: "Apple & Ginger Zest", category: "Juices", price: 500, stock: 55, unit: "500ml", description: "Crisp apple juice with a spicy ginger kick.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=300&auto=format&fit=crop" },
  { name: "Tropical Punch", category: "Juices", price: 520, stock: 60, unit: "500ml", description: "A vibrant mix of pineapple, passion, and orange juices.", image: "https://images.unsplash.com/photo-1497551060073-4c5ab6435f12?q=80&w=300&auto=format&fit=crop" },
  { name: "Beetroot & Carrot Detox", category: "Juices", price: 500, stock: 55, unit: "500ml", description: "Healthy beet and carrot blend for a natural energy boost.", image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=300&auto=format&fit=crop" },
  { name: "Deluxe Fruit Basket", category: "Lifestyle Bundles", price: 2500, stock: 20, unit: "basket", description: "A premium selection of seasonal fruits, beautifully presented.", image: "https://images.unsplash.com/photo-1590779033100-9f60502a6a3d?q=80&w=300&auto=format&fit=crop" },
  { name: "Small Wellness Basket", category: "Lifestyle Bundles", price: 1500, stock: 30, unit: "basket", description: "Perfect for a healthy gift or weekly home supply.", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=300&auto=format&fit=crop" },
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

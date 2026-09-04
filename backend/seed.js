require("dotenv").config();
const pool = require("./db");

const initialDestinations = [
  {
    name: "Australia",
    category: "Worldwide",
    description: "Discover the iconic Great Barrier Reef, Sydney Opera House, and breathtaking outback landscapes.",
    imageKey: "australia",
  },
  {
    name: "Japan",
    category: "Worldwide",
    description: "Marvel at serene historic temples, cherry blossoms, and futuristic city skylines.",
    imageKey: "japan",
  },
  {
    name: "China",
    category: "Worldwide",
    description: "Experience ancient history at the Great Wall and vibrant modern cultural metropolis hubs.",
    imageKey: "china",
  },
  {
    name: "Germany",
    category: "Worldwide",
    description: "Immerse yourself in fairy-tale castles, the Black Forest, and rich cultural history.",
    imageKey: "germany",
  },
  {
    name: "Ethiopia",
    category: "Africa",
    description: "Explore the ancient rock-hewn churches of Lalibela and stunning Simien Mountains.",
    imageKey: "ethiopia",
  },
  {
    name: "Tanzania",
    category: "Africa",
    description: "Embark on legendary Serengeti wildlife safaris and unwind on pristine Zanzibar beaches.",
    imageKey: "tanzania",
  },
  {
    name: "South Africa",
    category: "Africa",
    description: "Witness the majestic Table Mountain, world-class safari wildlife, and scenic coastlines.",
    imageKey: "southAfrica",
  },
  {
    name: "Ghana",
    category: "Africa",
    description: "Experience welcoming golden coastal beaches, rich Asante heritage, and bustling cultural markets.",
    imageKey: "ghana",
  },
];

async function seedDatabase() {
  console.log("Starting database seeding...");

  try {
    const existingCheck = await pool.query("SELECT COUNT(*) FROM destinations");
    const count = parseInt(existingCheck.rows[0].count, 10);

    if (count > 0) {
      console.log(`Database already has ${count} destination(s). Skipping seed.`);
      return;
    }

    console.log("Destinations table is empty. Inserting default destinations...");

    for (const dest of initialDestinations) {
      await pool.query(
        `INSERT INTO destinations (name, category, description, image_key)
         VALUES ($1, $2, $3, $4)`,
        [dest.name, dest.category, dest.description, dest.imageKey],
      );
      console.log(`  + Added destination: ${dest.name} (${dest.category})`);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error during database seeding:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
    console.log("Database connection closed.");
  }
}

seedDatabase();

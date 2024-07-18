import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();
const createDatabase = async () => {
    const pool = new Pool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432"),
        database: "postgres", // Connect to default database
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    try {
        // Check if database exists
        const res = await pool.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [process.env.DB_NAME]
        );

        if (res.rows.length === 0) {
            // Database doesn't exist, so create it
            await pool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`Database ${chalk.green.bold.bgWhite(process.env.DB_NAME)} created successfully`);
        } else {
            console.log(`Database ${chalk.white.bold.bgRed(process.env.DB_NAME)} already exists`);
        }
    } catch (error) {
        console.error("Error creating database:", error);
        throw error;
    } finally {
        await pool.end();
    }
};

const createItemsTable = `
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

const seedDatabase = async () => {
    await createDatabase();

    const pool = new Pool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432"),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    try {
        await pool.query(createItemsTable);
        console.log("Items table created successfully");

        // Insert some initial data
        const insertInitialData = `
        INSERT INTO items (name, description) 
        VALUES 
          ('Item 1', 'Description for Item 1'),
          ('Item 2', 'Description for Item 2')
        ON CONFLICT (name) 
        DO UPDATE SET 
          description = EXCLUDED.description,
          updated_at = CURRENT_TIMESTAMP
      `;
        await pool.query(insertInitialData);
        console.log("Initial data inserted successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    } finally {
        await pool.end();
    }
};

// Run the seeder
seedDatabase()
    .then(() => {
        console.log("Database seeding completed");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Database seeding failed:", error);
        process.exit(1);
    });

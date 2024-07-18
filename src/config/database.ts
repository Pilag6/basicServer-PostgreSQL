import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    allowExitOnIdle: true,
});

const checkConnection = async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log(
            chalk.whiteBright.bold.bgGreen(
                " << Initial database connection successful! :: "
            )
        );
    } catch (error) {
        console.error(
            chalk.red.bold("❌ Failed to connect to the database ❌")
        );
        console.error(chalk.red(error));
    }
};

export { pool, checkConnection };

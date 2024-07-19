import { pool } from "../config/database.js";
import { QueryResult } from "pg";
import chalk from "chalk";

interface Item {
    id?: number;
    name: string;
    description?: string;
}

const update = async (id: number, item: Item) => {
    try {
        const query = `UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *`;

        const result = await pool.query(query, [
            item.name,
            item.description,
            id
        ]);

        return result.rows[0];
    } catch (error) {
        console.error(chalk.red(error));
        throw new Error("Database query failed");
    }
};



export { update };

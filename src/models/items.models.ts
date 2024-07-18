import { pool } from "../config/database.js";
import chalk from "chalk";

interface Item {
    id?: number;
    name: string;
    description: string;
}

const findAll = async () => {
    try {
        const query = "SELECT * FROM items";

        const { rows } = await pool.query(query);

        return rows;
    } catch (error) {
        console.error(chalk.red(error));
        throw new Error("Database query failed");
    }
};

const findById = async (id: number) => {
    try {
        const query = "SELECT * FROM items WHERE id = $1";

        const result = await pool.query(query, [id]);

        return result.rows[0];
    } catch (error) {
        console.error(chalk.red(error));
        throw new Error("Database query failed");
    }
};

const create = async (item: Item) => {
    try {
        const query =
            "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *";

        const { rows } = await pool.query(query, [item.name, item.description]);

        return rows[0];
    } catch (error) {
        console.error(chalk.red(error));
        throw new Error("Database query failed");
    }
};

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

const remove = async (id: number) => {
    try {
        const query = "DELETE FROM items WHERE id = $1 RETURNING *";

        const result = await pool.query(query, [id]);

        return result.rows[0];
    } catch (error) {
        console.error(chalk.red(error));
        throw new Error("Database query failed");
    }
};

export { findAll, findById, create, update, remove };

import { pool } from "../config/database.js";
import chalk from "chalk";

interface Item {
    id?: number;
    name: string;
    description: string;
}

const findAll = async () => {
    try {
        const result = await pool.query("SELECT * FROM items");
        return result.rows;
    } catch (error) {
        console.error(chalk.red(error));
        throw new Error("Database query failed");
    }
};

const findById = async (id: number) => {
    try {
        const result = await pool.query("SELECT * FROM items WHERE id = $1", [
            id
        ]);
        return result.rows[0];
    } catch (error) {
        console.error(chalk.red(error));
        throw new Error("Database query failed");
    }
};

const create = async (item: Item) => {
    try {
        const result = await pool.query(
            "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *",
            [item.name, item.description]
        );
        return result.rows[0];
    } catch (error) {
        console.error(chalk.red(error));
        throw new Error("Database query failed");
    }
};

const update = async (id: number, item: Item) => {
    try {
        const result = await pool.query(
            "UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *",
            [item.name, item.description, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error(chalk.red(error));
        throw new Error("Database query failed");
    }
};

const remove = async (id: number) => {
    try {
        const result = await pool.query(
            "DELETE FROM items WHERE id = $1 RETURNING *",
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error(chalk.red(error));
        throw new Error("Database query failed");
    }
};

export { findAll, findById, create, update, remove };

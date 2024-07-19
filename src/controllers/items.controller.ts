import { Request, Response } from "express";
import chalk from "chalk";
import { pool } from "../config/database.js";
import { QueryResult } from "pg";
import { update } from "../models/items.models.js";
import asyncHandler from "../utils/asyncHandler.js";

interface Item {
    id?: number;
    name: string;
    description?: string;
}

// GET /api/items
const getAllItems = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const response: QueryResult<Item> = await pool.query(
                `SELECT * FROM items`
            );
            const items: Item[] = response.rows;
            return res.status(200).json(items);
        } catch (error) {
            console.error(chalk.red(error));
            return res.status(500).json({ message: "Internal Server error" });
        }
    }
);

// GET /api/items/:id
const getItem = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = parseInt(req.params.id);
            const response: QueryResult = await pool.query(
                `SELECT * FROM items WHERE id = $1`,
                [id]
            );
            return res.json(response.rows[0]);
        } catch (error) {
            console.error(chalk.red(error));
            return res.status(404).json({ message: "Item not found" });
        }
    }
);

// POST /api/items
const createItem = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const { name, description }: Item = req.body;
            const response: QueryResult = await pool.query(
                "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *",
                [name, description]
            );
            const createdItem: Item = response.rows[0];
            return res
                .status(201)
                .json({ message: "Item Created", body: createdItem });
        } catch (error) {
            console.error(chalk.red(error));
            return res
                .status(404)
                .json({ message: "Something went wrong. Item NOT created" });
        }
    }
);

// PATCH /api/items/:id
const updateItem = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const itemUpdate: Partial<Item> = req.body;

        const response: QueryResult<Item> = await pool.query(
            `UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
            [itemUpdate.name, itemUpdate.description, id]
        );

        if (response.rowCount === 0) {
            return res.status(404).json({ message: "Item not found" });
        }

        return res.json({
            message: `Item ${id} updated successfully`,
            item: response.rows[0]
        });
    } catch (error) {
        console.error(chalk.red(error));
        return res.status(500).json({ message: "Internal server error" });
    }
});

// DELETE /api/items/:id
const deleteItem = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = parseInt(req.params.id);
            const response: QueryResult<Item> = await pool.query(
                `DELETE FROM items WHERE id = $1 RETURNING *`,
                [id]
            );

            if (response.rowCount === 0) {
                return res.status(404).json({ message: "Item not found" });
            }

            return res.json({
                message: `Item ${id} deleted successfully`,
                item: response.rows[0]
            });
        } catch (error) {
            console.error(chalk.red(error));
            return res.status(500).json({ message: "Internal server error" });
        }
    }
);

export { getAllItems, getItem, createItem, updateItem, deleteItem };

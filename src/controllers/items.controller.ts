// Import necessary modules from Express and other dependencies
import { Request, Response } from "express";
import chalk from "chalk";
import { QueryResult } from "pg";

// Import custom modules
import { pool } from "../config/database.js";
import asyncHandler from "../utils/asyncHandler.js";

// Define the structure of an Item
interface Item {
    id?: number; // Optional id field
    name: string; // Required name field
    description?: string; // Optional description field
}

// GET /api/items - Retrieve all items
const getAllItems = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        try {
            // Execute SQL query to select all items
            const response: QueryResult<Item> = await pool.query(
                `SELECT * FROM items`
            );
            // Extract rows from the query result
            const items: Item[] = response.rows;
            // Return items with 200 OK status
            return res.status(200).json(items);
        } catch (error) {
            // Log error in red color
            console.error(chalk.red("🚫", error));
            // Return 500 Internal Server Error
            return res.status(500).json({ message: "Internal Server error" });
        }
    }
);

// GET /api/items/:id - Retrieve a specific item by id
const getItem = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        try {
            // Parse id from request parameters
            const id = parseInt(req.params.id);
            // Execute SQL query to select item by id
            const response: QueryResult = await pool.query(
                `SELECT * FROM items WHERE id = $1`,
                [id]
            );
            // If no item found, return 404 Not Found
            if (response.rowCount === 0) {
                return res.status(404).json({ message: "Item not found" });
            }
            // Return the found item
            return res.json(response.rows[0]);
        } catch (error) {
            // Log error in red color
            console.error(chalk.white.bgRed("🚫", error));
            // Return 500 Internal Server Error
            return res.status(500).json({ message: "Internal Server error" });
        }
    }
);

// POST /api/items - Create a new item
const createItem = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        try {
            // Extract name and description from request body
            const { name, description }: Item = req.body;
            // If name is not provided, return 400 Bad Request
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            // Execute SQL query to insert new item
            const response: QueryResult<Item> = await pool.query(
                "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *", // With RETURNING *, I make sure to get the created item back
                [name, description]
            );
            // Extract the created item from the query result
            const createdItem: Item = response.rows[0];
            // Return the created item with 201 Created status
            return res
                .status(201)
                .json({ message: "Item Created", body: createdItem });
        } catch (error) {
            // Log error in red color
            console.error(chalk.red("🚫", error));
            // Return 500 Internal Server Error
            return res.status(500).json({ message: "Internal Server error" });
        }
    }
);

// PATCH /api/items/:id - Update an existing item
const updateItem = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        try {
            // Parse id from request parameters
            const id = parseInt(req.params.id);
            // Extract update data from request body
            const itemUpdate: Partial<Item> = req.body;

            // If no update data provided, return 400 Bad Request
            if (Object.keys(itemUpdate).length === 0) {
                return res
                    .status(400)
                    .json({ message: "No update data provided" });
            }

            // Initialize SQL query
            let query = "UPDATE items SET ";
            let queryParams = [];
            let paramCount = 1;

            // If name is provided in update data, add to query
            if (itemUpdate.name !== undefined) {
                query += `name = $${paramCount}, `;
                queryParams.push(itemUpdate.name);
                paramCount++;
            }
            // If description is provided in update data, add to query
            if (itemUpdate.description !== undefined) {
                query += `description = $${paramCount}, `;
                queryParams.push(itemUpdate.description);
                paramCount++;
            }

            // Remove trailing comma and space from query
            query = query.slice(0, -2);
            // Add WHERE clause and RETURNING * to query
            query += ` WHERE id = $${paramCount} RETURNING *`;
            queryParams.push(id);

            // Execute the constructed SQL query
            const response: QueryResult<Item> = await pool.query(
                query,
                queryParams
            );

            // If no item found, return 404 Not Found
            if (response.rowCount === 0) {
                return res.status(404).json({ message: "Item not found" });
            }

            // Return success message and updated item
            return res.json({
                message: `Item ${id} updated successfully`,
                item: response.rows[0]
            });
        } catch (error) {
            // Log error in red color
            console.error(chalk.red("🚫", error));
            // Return 500 Internal Server Error
            return res.status(500).json({ message: "Internal server error" });
        }
    }
);

// DELETE /api/items/:id - Delete an existing item
const deleteItem = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
        try {
            // Parse id from request parameters
            const id = parseInt(req.params.id);
            // Execute SQL query to delete item
            const response: QueryResult<Item> = await pool.query(
                `DELETE FROM items WHERE id = $1 RETURNING *`,
                [id]
            );

            // If no item found, return 404 Not Found
            if (response.rowCount === 0) {
                return res.status(404).json({ message: "Item not found" });
            }

            // Return success message and deleted item
            return res.json({
                message: `Item ${id} deleted successfully`,
                item: response.rows[0]
            });
        } catch (error) {
            // Log error in red color
            console.error(chalk.red("🚫", error));
            // Return 500 Internal Server Error
            return res.status(500).json({ message: "Internal server error" });
        }
    }
);

// Export all functions for use in other modules
export { getAllItems, getItem, createItem, updateItem, deleteItem };

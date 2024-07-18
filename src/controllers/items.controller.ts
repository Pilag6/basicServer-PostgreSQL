import {
    findAll,
    findById,
    create,
    update,
    remove
} from "../models/items.models.js";
import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/items
const getAllItems = asyncHandler(async (req: Request, res: Response) => {
    const items = await findAll();
    res.json(items);
});

// GET /api/items/:id
const getItem = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await findById(Number(id));
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: "Item not found" });
    }
});

// POST /api/items
const createItem = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const newItem = await create({ name, description });
    res.status(201).json(newItem);
});

// PATCH /api/items/:id
const updateItem = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedItem = await update(Number(id), { name, description });
    if (updatedItem) {
        res.json(updatedItem);
    } else {
        res.status(404).json({ message: "Item not found" });
    }
});

// DELETE /api/items/:id
const deleteItem = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await remove(Number(id));
    if (deleted) {
        res.json({ message: "Item deleted successfully" });
    } else {
        res.status(404).json({ message: "Item not found" });
    }
});

export { getAllItems, getItem, createItem, updateItem, deleteItem };

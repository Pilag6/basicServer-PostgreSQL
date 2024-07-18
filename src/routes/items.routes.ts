import { Router } from "express";
import {
    getAllItems,
    getItem,
    createItem,
    updateItem,
    deleteItem
} from "../controllers/items.controller.js";

const router = Router();

router.get("/", getAllItems);
router.get("/:id", getItem);
router.post("/", createItem);
router.patch("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;

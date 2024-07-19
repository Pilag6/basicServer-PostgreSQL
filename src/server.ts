import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import chalk from "chalk";
import { checkConnection } from "./config/database.js";
import itemsRoute from "./routes/items.routes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

// Check database connection
checkConnection();

const app: Application = express();

const PORT = process.env.PORT || 5550;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World!" });
});

app.use("/api/items", itemsRoute);

// Error handling middleware
app.use(errorHandler);

// Start 
app.listen(PORT, () => {
    console.log(
        chalk.blue.bold.bgWhite(
            ` 👀 Server is running at http://localhost:${PORT} 👀 `
        )
    );
});

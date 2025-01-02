import express from "express";
import { list, getById } from "./product.controller";

const router = express.Router();

router.get("/", list);
router.get("/:id", getById);

export default router;

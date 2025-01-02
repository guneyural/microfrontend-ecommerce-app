import { Request, Response } from "express";
import { getProducts, getProductById } from "./product.service";

export const list = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const minPrice = req.query.minPrice
      ? parseFloat(req.query.minPrice as string)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? parseFloat(req.query.maxPrice as string)
      : undefined;

    // Validate numeric parameters
    if (
      isNaN(page) ||
      isNaN(limit) ||
      (req.query.minPrice && isNaN(minPrice as number)) ||
      (req.query.maxPrice && isNaN(maxPrice as number))
    ) {
      return res.status(400).json({ message: "Invalid numeric parameters" });
    }

    const filters = {
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
      ...(req.query.category && { category: req.query.category as string }),
      ...(req.query.inStock && { inStock: req.query.inStock === "true" }),
      ...(req.query.search && { search: req.query.search as string }),
    };

    const products = await getProducts(filters, {
      page,
      limit,
      sortOrder: "desc",
    });

    res.json(products);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

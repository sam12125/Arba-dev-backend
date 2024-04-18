const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const { name, slug, image } = req.body;
    const newCategory = new Category({
      name,
      slug,
      image,
    });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/categories/:id", async (req, res) => {
  try {
    const { name, slug, image } = req.body;
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (name) category.name = name;
    if (slug) category.slug = slug;
    if (image) category.image = image;
    category = await category.save();
    res.status(200).json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

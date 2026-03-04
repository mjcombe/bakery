import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("bakery.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    plan TEXT DEFAULT 'free',
    trial_ends_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    base_batch_weight REAL,
    method TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER,
    name TEXT,
    weight REAL,
    is_flour BOOLEAN DEFAULT 0,
    FOREIGN KEY(recipe_id) REFERENCES recipes(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock Auth for Demo (In a real app, use proper JWT or Sessions)
  app.post("/api/auth/login", (req, res) => {
    const { email } = req.body;
    let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) {
      db.prepare("INSERT INTO users (email, plan) VALUES (?, 'starter')").run(email);
      user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
      
      // Seed initial recipes for new users
      const sourdoughMethod = `1. Mix Levain (18h before): Add flour, water and levain. Mix 10 min at speed 1 and let rest.
2. Dough Mix: Add salt. Mix 10 min speed 2.
3. Bulk Fermentation: Place dough in lightly oiled tub and cover. Bulk ferment for 1 to 3h, doing stretch and folds every 30 min.
4. After bulk, shape into banetons of 850g each and put in fridge overnight.
5. Bake in pre-heat oven at 250°C for 20min steam. Release steam and bake 15 min more.`;

      const recipeInfo = db.prepare("INSERT INTO recipes (user_id, name, base_batch_weight, method) VALUES (?, ?, ?, ?)").run(user.id, "White Sourdough Loaf (2024)", 850, sourdoughMethod);
      const recipeId = recipeInfo.lastInsertRowid;
      
      const insertIng = db.prepare("INSERT INTO ingredients (recipe_id, name, weight, is_flour) VALUES (?, ?, ?, ?)");
      insertIng.run(recipeId, "WT 65 Flour", 427, 1);
      insertIng.run(recipeId, "Levain Flour (from starter)", 60, 1);
      insertIng.run(recipeId, "Water (Dough)", 311, 0);
      insertIng.run(recipeId, "Water (in Levain)", 30, 0);
      insertIng.run(recipeId, "Salt", 12, 0);
      insertIng.run(recipeId, "Wheat Starter", 10, 0);

      // Milk Loaf
      const milkLoaf = db.prepare("INSERT INTO recipes (user_id, name, base_batch_weight) VALUES (?, ?, ?)").run(user.id, "Milk Loaf", 887);
      const mlId = milkLoaf.lastInsertRowid;
      insertIng.run(mlId, "Bread Flour", 500, 1);
      insertIng.run(mlId, "Whole Milk", 300, 0);
      insertIng.run(mlId, "Unsalted Butter", 50, 0);
      insertIng.run(mlId, "Caster Sugar", 20, 0);
      insertIng.run(mlId, "Salt", 10, 0);
      insertIng.run(mlId, "Instant Yeast", 7, 0);

      // Scones
      const scones = db.prepare("INSERT INTO recipes (user_id, name, base_batch_weight) VALUES (?, ?, ?)").run(user.id, "Classic Scones (Batch)", 972);
      const scId = scones.lastInsertRowid;
      insertIng.run(scId, "Self-Raising Flour", 500, 1);
      insertIng.run(scId, "Cold Butter", 125, 0);
      insertIng.run(scId, "Whole Milk", 250, 0);
      insertIng.run(scId, "Caster Sugar", 75, 0);
      insertIng.run(scId, "Baking Powder", 20, 0);
      insertIng.run(scId, "Salt", 2, 0);

      // Ciabatta
      const ciabatta = db.prepare("INSERT INTO recipes (user_id, name, base_batch_weight) VALUES (?, ?, ?)").run(user.id, "Ciabatta with Biga", 935);
      const cbId = ciabatta.lastInsertRowid;
      insertIng.run(cbId, "Strong Bread Flour", 500, 1);
      insertIng.run(cbId, "Water", 400, 0);
      insertIng.run(cbId, "Salt", 10, 0);
      insertIng.run(cbId, "Olive Oil", 20, 0);
      insertIng.run(cbId, "Instant Yeast", 5, 0);
    }
    res.json({ user });
  });

  app.get("/api/recipes/public", (req, res) => {
    // Return a few sample recipes with limited info
    const recipes = db.prepare("SELECT id, name, base_batch_weight FROM recipes LIMIT 4").all();
    res.json(recipes);
  });

  app.get("/api/recipes", (req, res) => {
    // In real app, filter by user_id from session
    // For this demo, we'll just return all but in a real app we'd check auth
    const recipes = db.prepare("SELECT * FROM recipes ORDER BY created_at DESC").all();
    const recipesWithIngredients = recipes.map(recipe => {
      const ingredients = db.prepare("SELECT * FROM ingredients WHERE recipe_id = ?").all(recipe.id);
      return { ...recipe, ingredients };
    });
    res.json(recipesWithIngredients);
  });

  app.post("/api/recipes", (req, res) => {
    const { name, ingredients, base_batch_weight, method } = req.body;
    const info = db.prepare("INSERT INTO recipes (name, base_batch_weight, method) VALUES (?, ?, ?)").run(name, base_batch_weight, method);
    const recipeId = info.lastInsertRowid;

    const insertIngredient = db.prepare("INSERT INTO ingredients (recipe_id, name, weight, is_flour) VALUES (?, ?, ?, ?)");
    for (const ing of ingredients) {
      insertIngredient.run(recipeId, ing.name, ing.weight, ing.is_flour ? 1 : 0);
    }

    res.json({ id: recipeId });
  });

  app.get("/api/recipes/:id", (req, res) => {
    const recipe = db.prepare("SELECT * FROM recipes WHERE id = ?").get(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Not found" });
    const ingredients = db.prepare("SELECT * FROM ingredients WHERE recipe_id = ?").all(req.params.id);
    res.json({ ...recipe, ingredients });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SS Bakery Server running on http://localhost:${PORT}`);
  });
}

startServer();

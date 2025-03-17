import express from 'express';
import db from '../db/index.js';
import { authenticate, authorize } from '../middleware/authenticate.js';

const router = express.Router();

// Get all product categories
router.get('/categories', authenticate, authorize('stall_manager'), async (req, res, next) => {
  try {
    const categories = await db.query(`
      SELECT * FROM inventory_categories
      ORDER BY name
    `);

    res.json(categories.rows);
  } catch (error) {
    next(error);
  }
});

// Get all products for a stall
router.get('/stalls/:stallId/products', authenticate, authorize('stall_manager'), async (req, res, next) => {
  try {
    const { stallId } = req.params;

    // Check if user has access to this stall
    const stallAccess = await db.query(`
      SELECT s.id FROM stalls s
      WHERE s.id = $1 AND (s.manager_id = $2 OR EXISTS (
        SELECT 1 FROM stall_events se
        WHERE se.id = s.stall_event_id AND se.organizer_id = $2
      ))
    `, [stallId, req.user.id]);

    if (stallAccess.rows.length === 0) {
      return res.status(403).json({ message: 'You do not have access to this stall' });
    }

    const products = await db.query(`
      SELECT p.*, c.name as category_name
      FROM inventory_products p
      JOIN inventory_categories c ON p.category_id = c.id
      WHERE p.stall_id = $1 AND p.is_active = TRUE
      ORDER BY p.created_at DESC
    `, [stallId]);

    res.json(products.rows);
  } catch (error) {
    next(error);
  }
});

// Add a new product to inventory
router.post('/stalls/:stallId/products', authenticate, authorize('stall_manager'), async (req, res, next) => {
  try {
    const { stallId } = req.params;
    const {
      name, category_id, price, quantity, description,
      size, color, ingredients, allergens, dietary,
      material, weight, dimensions, image_url
    } = req.body;

    // Check if user has access to this stall
    const stallAccess = await db.query(`
      SELECT s.id FROM stalls s
      WHERE s.id = $1 AND (s.manager_id = $2 OR EXISTS (
        SELECT 1 FROM stall_events se
        WHERE se.id = s.stall_event_id AND se.organizer_id = $2
      ))
    `, [stallId, req.user.id]);

    if (stallAccess.rows.length === 0) {
      return res.status(403).json({ message: 'You do not have access to this stall' });
    }

    // Validate required fields
    if (!name || !category_id || !price || quantity === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Start a transaction
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      // Insert the product
      const productResult = await client.query(`
        INSERT INTO inventory_products (
          stall_id, category_id, name, description, price, quantity,
          size, color, ingredients, allergens, dietary,
          material, weight, dimensions, image_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `, [
        stallId, category_id, name, description, price, quantity,
        size, color, ingredients, allergens, dietary,
        material, weight, dimensions, image_url
      ]);

      const product = productResult.rows[0];

      // Record the transaction
      await client.query(`
        INSERT INTO inventory_transactions (
          product_id, stall_id, user_id, transaction_type, quantity, previous_quantity, notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        product.id, stallId, req.user.id, 'add', quantity, 0, 'Initial inventory'
      ]);

      await client.query('COMMIT');

      // Get the category name for the response
      const categoryResult = await db.query(`
        SELECT name FROM inventory_categories WHERE id = $1
      `, [category_id]);

      product.category_name = categoryResult.rows[0]?.name;

      res.status(201).json(product);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
});

// Update a product
router.put('/products/:productId', authenticate, authorize('stall_manager'), async (req, res, next) => {
  try {
    const { productId } = req.params;
    const {
      name, category_id, price, quantity, description,
      size, color, ingredients, allergens, dietary,
      material, weight, dimensions, image_url
    } = req.body;

    // Check if user has access to this product
    const productAccess = await db.query(`
      SELECT p.id, p.stall_id, p.quantity FROM inventory_products p
      JOIN stalls s ON p.stall_id = s.id
      WHERE p.id = $1 AND (s.manager_id = $2 OR EXISTS (
        SELECT 1 FROM stall_events se
        WHERE se.id = s.stall_event_id AND se.organizer_id = $2
      ))
    `, [productId, req.user.id]);

    if (productAccess.rows.length === 0) {
      return res.status(403).json({ message: 'You do not have access to this product' });
    }

    const previousQuantity = productAccess.rows[0].quantity;
    const stallId = productAccess.rows[0].stall_id;

    // Start a transaction
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      // Update the product
      const productResult = await client.query(`
        UPDATE inventory_products
        SET 
          name = COALESCE($1, name),
          category_id = COALESCE($2, category_id),
          price = COALESCE($3, price),
          quantity = COALESCE($4, quantity),
          description = COALESCE($5, description),
          size = COALESCE($6, size),
          color = COALESCE($7, color),
          ingredients = COALESCE($8, ingredients),
          allergens = COALESCE($9, allergens),
          dietary = COALESCE($10, dietary),
          material = COALESCE($11, material),
          weight = COALESCE($12, weight),
          dimensions = COALESCE($13, dimensions),
          image_url = COALESCE($14, image_url),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $15
        RETURNING *
      `, [
        name, category_id, price, quantity, description,
        size, color, ingredients, allergens, dietary,
        material, weight, dimensions, image_url,
        productId
      ]);

      const product = productResult.rows[0];

      // If quantity changed, record the transaction
      if (quantity !== undefined && quantity !== previousQuantity) {
        await client.query(`
          INSERT INTO inventory_transactions (
            product_id, stall_id, user_id, transaction_type, quantity, previous_quantity, notes
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          productId, stallId, req.user.id, 'update', quantity, previousQuantity, 'Inventory update'
        ]);
      }

      await client.query('COMMIT');

      // Get the category name for the response
      const categoryResult = await db.query(`
        SELECT name FROM inventory_categories WHERE id = $1
      `, [product.category_id]);

      product.category_name = categoryResult.rows[0]?.name;

      res.json(product);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
});

// Delete a product
router.delete('/products/:productId', authenticate, authorize('stall_manager'), async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Check if user has access to this product
    const productAccess = await db.query(`
      SELECT p.id, p.stall_id, p.quantity FROM inventory_products p
      JOIN stalls s ON p.stall_id = s.id
      WHERE p.id = $1 AND (s.manager_id = $2 OR EXISTS (
        SELECT 1 FROM stall_events se
        WHERE se.id = s.stall_event_id AND se.organizer_id = $2
      ))
    `, [productId, req.user.id]);

    if (productAccess.rows.length === 0) {
      return res.status(403).json({ message: 'You do not have access to this product' });
    }

    const previousQuantity = productAccess.rows[0].quantity;
    const stallId = productAccess.rows[0].stall_id;

    // Start a transaction
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      // Soft delete the product by marking it as inactive
      await client.query(`
        UPDATE inventory_products
        SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [productId]);

      // Record the transaction
      await client.query(`
        INSERT INTO inventory_transactions (
          product_id, stall_id, user_id, transaction_type, quantity, previous_quantity, notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        productId, stallId, req.user.id, 'remove', 0, previousQuantity, 'Product removed'
      ]);

      await client.query('COMMIT');

      res.json({ message: 'Product removed successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
});

// Get inventory transaction history for a stall
router.get('/stalls/:stallId/transactions', authenticate, authorize('stall_manager'), async (req, res, next) => {
  try {
    const { stallId } = req.params;

    // Check if user has access to this stall
    const stallAccess = await db.query(`
      SELECT s.id FROM stalls s
      WHERE s.id = $1 AND (s.manager_id = $2 OR EXISTS (
        SELECT 1 FROM stall_events se
        WHERE se.id = s.stall_event_id AND se.organizer_id = $2
      ))
    `, [stallId, req.user.id]);

    if (stallAccess.rows.length === 0) {
      return res.status(403).json({ message: 'You do not have access to this stall' });
    }

    const transactions = await db.query(`
      SELECT t.*, p.name as product_name, u.first_name || ' ' || u.last_name as user_name
      FROM inventory_transactions t
      JOIN inventory_products p ON t.product_id = p.id
      JOIN users u ON t.user_id = u.id
      WHERE t.stall_id = $1
      ORDER BY t.created_at DESC
      LIMIT 100
    `, [stallId]);

    res.json(transactions.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
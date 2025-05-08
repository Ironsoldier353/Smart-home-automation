import express from 'express';
import { 
  getAllRecipes, 
  getRecipeById, 
  createRecipe, 
  generateRecipeWithAI,
  updateRecipe, 
  deleteRecipe 
} from '../controllers/recipe.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.post('/generate', generateRecipeWithAI); // Made public - no authMiddleware

// Protected routes - require authentication
router.post('/', authMiddleware, createRecipe);
router.put('/:id', authMiddleware, updateRecipe);
router.delete('/:id', authMiddleware, deleteRecipe);

export default router;
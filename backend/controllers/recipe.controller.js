import Recipe from '../models/recipe.model.js';
import { generateRecipe } from '../utils/gemini.js';

// Get all recipes with optional filtering
export const getAllRecipes = async (req, res) => {
  try {
    const { userId, tag } = req.query;
    const query = {};
    
    // Add filters if provided
    if (userId) {
      query.userId = userId;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    const recipes = await Recipe.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name id');
    
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

// Get a single recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('userId', 'name id');
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    res.status(200).json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
};

// Create a new recipe manually
export const createRecipe = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const recipeData = req.body;
    
    const recipe = await Recipe.create({
      ...recipeData,
      userId: req.userId,
      isGenerated: false
    });
    
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
};

// Generate a recipe with AI using ingredients
export const generateRecipeWithAI = async (req, res) => {
  try {
    // Parse the request body
    const recipeSuggestionRequest = req.body;
    console.log('Recipe suggestion request:', recipeSuggestionRequest);

    // Validate input
    if (!recipeSuggestionRequest.ingredients || 
        !Array.isArray(recipeSuggestionRequest.ingredients) || 
        recipeSuggestionRequest.ingredients.length === 0) {
      return res.status(400).json({ 
        error: 'Ingredients are required and must be an array' 
      });
    }

    try {
      // Generate recipe using Gemini AI
      console.log('Calling Gemini API...');
      let generatedRecipe;
      
      try {
        generatedRecipe = await generateRecipe(recipeSuggestionRequest);
        console.log('Recipe generated successfully:', generatedRecipe);
      } catch (geminiError) {
        // If API key is invalid, provide a fallback response for testing purposes
        if (geminiError.message && geminiError.message.includes('API key not valid')) {
          console.log('Using fallback recipe due to API key issue');
          generatedRecipe = {
            title: "Fallback Recipe with " + recipeSuggestionRequest.ingredients[0],
            description: "A simple dish using your ingredients. Note: Gemini API key is invalid or missing, this is a fallback response.",
            ingredients: recipeSuggestionRequest.ingredients.map(ing => `${ing} - as needed`),
            instructions: ["Combine all ingredients", "Cook until done", "Serve and enjoy"],
            prepTime: 10,
            cookTime: 20,
            difficulty: "medium",
            cuisine: recipeSuggestionRequest.cuisinePreference || "fusion",
            tags: ["fallback", "simple"],
            nutritionalInfo: {
              calories: 300,
              protein: 15,
              carbs: 30,
              fat: 10
            }
          };
        } else {
          // If it's another error, re-throw it
          throw geminiError;
        }
      }
      
      // Check that we have the required fields
      if (!generatedRecipe.title || !generatedRecipe.ingredients || !generatedRecipe.instructions) {
        throw new Error('Generated recipe is missing required fields');
      }

      // Calculate total time if both prep and cook time are available
      const totalTime = (generatedRecipe.prepTime && generatedRecipe.cookTime) 
        ? generatedRecipe.prepTime + generatedRecipe.cookTime 
        : null;

      // Create response object with the generated recipe
      const recipeResponse = {
        title: generatedRecipe.title,
        description: generatedRecipe.description || '',
        ingredients: generatedRecipe.ingredients,
        instructions: generatedRecipe.instructions,
        prepTime: generatedRecipe.prepTime,
        cookTime: generatedRecipe.cookTime,
        totalTime: totalTime,
        difficulty: generatedRecipe.difficulty || null,
        cuisine: generatedRecipe.cuisine || null,
        isGenerated: true,
        nutritionalInfo: generatedRecipe.nutritionalInfo || null,
        tags: generatedRecipe.tags || []
      };
      
      // Save to database only if user is authenticated
      if (req.userId) {
        console.log('Saving recipe to database...');
        const savedRecipe = await Recipe.create({
          ...recipeResponse,
          userId: req.userId,
          nutritionalInfo: undefined // Don't save nutritionalInfo in the recipe model
        });
        
        console.log('Recipe saved successfully:', savedRecipe.id);
        
        // Return the saved recipe with its ID
        return res.status(201).json({ 
          recipe: savedRecipe,
          nutritionalInfo: generatedRecipe.nutritionalInfo
        });
      }
      
      // If user is not authenticated, just return the generated recipe without saving
      return res.status(200).json({ 
        recipe: recipeResponse,
        nutritionalInfo: generatedRecipe.nutritionalInfo
      });
      
    } catch (aiError) {
      console.error('Error in AI recipe generation:', aiError);
      res.status(422).json({ 
        error: 'AI could not generate a suitable recipe. Please try different ingredients or preferences.' 
      });
    }
  } catch (error) {
    console.error('Error in recipe generation API:', error);
    res.status(500).json({ 
      error: 'Failed to generate recipe. Please try again.' 
    });
  }
};

// Update a recipe
export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find recipe and check ownership
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    // Check if user owns the recipe
    if (recipe.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this recipe' });
    }
    
    // Update recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
};

// Delete a recipe
export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find recipe and check ownership
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    // Check if user owns the recipe
    if (recipe.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this recipe' });
    }
    
    // Delete recipe
    await Recipe.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};
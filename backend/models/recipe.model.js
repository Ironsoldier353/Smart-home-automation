import mongoose, { Schema } from "mongoose";

const recipeSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  ingredients: {
    type: [String],
    required: [true, 'Ingredients are required']
  },
  instructions: {
    type: [String],
    required: [true, 'Instructions are required']
  },
  prepTime: {
    type: Number,
    default: null
  },
  cookTime: {
    type: Number,
    default: null
  },
  totalTime: {
    type: Number,
    default: null
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', null],
    default: null
  },
  cuisine: {
    type: String,
    default: null
  },
  calories: {
    type: Number,
    default: null
  },
  tags: {
    type: [String],
    default: []
  },
  isGenerated: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, { timestamps: true });

// Add virtual for nutritional info - not stored in DB but can be returned in responses
recipeSchema.virtual('nutritionalInfo').get(function() {
  if (this.calories) {
    return {
      calories: this.calories,
      // Add more nutritional fields here if you decide to store them later
    };
  }
  return null;
});

// Set toJSON option to include virtuals
recipeSchema.set('toJSON', { virtuals: true });
recipeSchema.set('toObject', { virtuals: true });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
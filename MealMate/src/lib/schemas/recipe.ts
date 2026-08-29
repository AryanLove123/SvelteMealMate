import { z } from "zod";

export const loginInputSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, "Username must be at least 2 characters")
    .max(30)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, _ and -",
    ),
});

export const ingredientSchema = z.object({
  name: z.string().trim().min(1, 'Ingredient name is required').max(120),
  measure: z.string().trim().max(60).optional().default(''),
});

export const recipeInputSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(150),
  description: z.string().trim().max(2000).optional().default(''),
  imageUrl: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .default('')
    .refine(val => val === '' || /^https?:\/\//i.test(val), 'Image URL must start with http(s)://'),
  category: z.string().trim().min(1, 'Category is required').max(80),
  area: z.string().trim().max(80).optional().default(''),
  ingredients: z.array(ingredientSchema).min(1, 'At least one ingredient is required').max(60),
  instructions: z.string().trim().min(10, 'Instructions must be at least 10 characters').max(10000),
});

export type RecipeInput = z.infer<typeof recipeInputSchema>;


export const mealPlanInputSchema = z.object({
  recipeId: z.string().trim().min(1),
  source: z.enum(['external', 'community']),
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  weekStart: z.string().trim().min(1),
});

export const mealPlanUpdateSchema = mealPlanInputSchema.partial().extend({
  recipeId: z.string().trim().min(1).optional(),
});
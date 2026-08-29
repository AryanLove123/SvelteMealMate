import { refKey } from "../../../lib/shared/common-utility.ts";
import type {
  MealPlanEntry,
  MealType,
  WeekDay,
} from "../../../lib/models/mealPlan.model.ts";
import type { RecipeSource } from "../../../lib/models/recipe.model.ts";
import { COLLECTIONS, getCollection } from "../db/mongo.ts";
import { resolveRecipeSummaries } from "../services/recipeResolver.ts";
import { randomUUID } from "node:crypto";

interface MealPlanDoc {
  _id: string;
  userId: string;
  recipeId: string;
  source: RecipeSource;
  day: WeekDay;
  mealType: MealType;
  weekStart: string;
  createdAt: string;
  updatedAt: string;
}

export async function listMealPlan(
  userId: string,
  weekStart: string,
): Promise<MealPlanEntry[]> {
  const col = await getCollection<MealPlanDoc>(COLLECTIONS.mealPlan);
  const docs = await col.find({ userId, weekStart }).toArray();

  const summaries = await resolveRecipeSummaries(
    docs.map((doc) => ({ recipeId: doc.recipeId, source: doc.source })),
  );

  return docs.map((doc) => ({
    id: doc._id,
    recipeId: doc.recipeId,
    source: doc.source,
    day: doc.day,
    mealType: doc.mealType,
    weekStart: doc.weekStart,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    recipe: summaries.get(refKey(doc.recipeId, doc.source)) ?? null,
  }));
}

export async function addMealPlanEntry(
  userId: string,
  input: {
    recipeId: string;
    source: RecipeSource;
    day: WeekDay;
    mealType: MealType;
    weekStart: string;
  },
): Promise<MealPlanEntry> {
  const col = await getCollection<MealPlanDoc>(COLLECTIONS.mealPlan);
  const now = new Date().toISOString();
  const doc: MealPlanDoc = {
    _id: randomUUID(),
    userId,
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  await col.insertOne(doc);

  const summaries = await resolveRecipeSummaries([
    { recipeId: doc.recipeId, source: doc.source },
  ]);

  return {
    ...doc,
    id: doc._id,
    recipe: summaries.get(refKey(doc.recipeId, doc.source)) ?? null,
  };
}

export async function updateMealPlanEntry(
  userId: string,
  id: string,
  patch: Partial<{
    recipeId: string;
    source: RecipeSource;
    day: WeekDay;
    mealType: MealType;
  }>,
): Promise<"updated" | "not-found"> {
  const col = await getCollection<MealPlanDoc>(COLLECTIONS.mealPlan);
  const res = await col.updateOne(
    { _id: id, userId },
    { $set: { ...patch, updatedAt: new Date().toISOString() } },
  );

  return res.matchedCount > 0 ? "updated" : "not-found";
}

export async function removeMealPlanEntry(
  userId: string,
  id: string,
): Promise<"deleted" | "not-found"> {
  const col = await getCollection<MealPlanDoc>(COLLECTIONS.mealPlan);
  const res = await col.deleteOne({_id: id, userId});
  return res.deletedCount> 0 ? 'deleted': 'not-found';
}

export async function removeMealPlanEntriesForRecipe(recipeId: string, source: RecipeSource): Promise<number> {
  const col = await getCollection<MealPlanDoc>(COLLECTIONS.mealPlan);
  const res = await col.deleteMany({ recipeId, source });
  return res.deletedCount ?? 0;
}

import type { FavoriteEntry } from "../../../lib/models/favorite.model.ts";
import type { RecipeSource } from "../../../lib/models/recipe.model.ts";
import { refKey } from "../../../lib/shared/common-utility.ts";
import { COLLECTIONS, getCollection } from "../db/mongo.ts";
import { resolveRecipeSummaries } from "../services/recipeResolver.ts";

interface FavoriteDoc {
  _id: string;
  userId: string;
  recipeId: string;
  source: RecipeSource;
  createdAt: string;
}

export async function getFavoriteKeys(userId: string): Promise<Set<string>> {
  const col = await getCollection<FavoriteDoc>(COLLECTIONS.favorites);
  const docs = await col.find({ userId }).project({ recipeId: 1, source: 1 }).toArray();
  return new Set(docs.map(d => refKey(d.recipeId, d.source)));
}

export async function isFavorite(userId: string, recipeId: string, source: RecipeSource): Promise<boolean> {
  const col = await getCollection<FavoriteDoc>(COLLECTIONS.favorites);
  const doc = await col.findOne({ userId, recipeId, source });
  return !!doc;
}

export async function listFavorites(userId: string): Promise<FavoriteEntry[]>{
  const col = await getCollection<FavoriteDoc>(COLLECTIONS.favorites);
  const docs = await col.find({userId}).sort({createdAt: -1}).toArray();
  const summaries = await resolveRecipeSummaries(docs.map(doc => ({recipeId: doc.recipeId, source: doc.source})));

  return docs.map(doc =>({
    id: doc._id,
    recipeId: doc.recipeId,
    source: doc.source,
    createdAt: doc.createdAt,
    recipe: summaries.get(refKey(doc.recipeId, doc.source))?? null,
  }))
}
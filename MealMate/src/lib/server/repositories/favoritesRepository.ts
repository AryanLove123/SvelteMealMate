import { randomUUID } from "node:crypto";
import type { FavoriteEntry } from "../../../lib/models/favorite.model.ts";
import type { RecipeSource } from "../../../lib/models/recipe.model.ts";
import { refKey } from "../../../lib/shared/common-utility.ts";
import { COLLECTIONS, getCollection } from "../db/mongo.ts";
import { resolveRecipeSummaries } from "../services/recipeResolver.ts";
import { MongoServerError } from "mongodb";

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

export async function addFavorite(userId: string, recipeId: string, source: RecipeSource ): Promise<'created' | 'already-exists'>{
  const col = await getCollection<FavoriteDoc>(COLLECTIONS.favorites);
  const existing = await col.findOne({userId, recipeId, source});

  if(existing) return 'already-exists';

  try{
    await col.insertOne({
      _id: randomUUID(),
      userId,
      recipeId,
      source,
      createdAt: new Date().toISOString(),
    });
    return 'created';
  } catch(err){
    if (err instanceof MongoServerError && err.code === 11000) {
      return 'already-exists';
    }
    throw err;
  }
}

export async function removeFavoriteById(userId: string, favoriteId: string): Promise<'deleted' | 'not-found'> {
  const col = await getCollection<FavoriteDoc>(COLLECTIONS.favorites);
  const res = await col.deleteOne({_id: favoriteId, userId});
  return res.deletedCount > 0 ? 'deleted': 'not-found';
}

export async function removeFavoriteByRecipe(userId: string, recipeId: string, source: RecipeSource): Promise<'deleted' | 'not-found'> {
  const col = await getCollection<FavoriteDoc>(COLLECTIONS.favorites);
  const res = await col.deleteOne({ userId, recipeId, source });
  return res.deletedCount > 0 ? 'deleted' : 'not-found';
}

//When a recipe is delete than all the favorites refrencing it are also removed
export async function removeFavoritesForRecipe(recipeId: string, source: RecipeSource): Promise<number> {
  const col = await getCollection<FavoriteDoc>(COLLECTIONS.favorites);
  const res = await col.deleteMany({ recipeId, source });
  return res.deletedCount ?? 0;
}
import type { RecipeInput } from "../../../lib/schemas/recipe.ts";
import type { Recipe, RecipeSummary } from "../../../lib/models/recipe.model.ts";
import { COLLECTIONS, getCollection } from "../db/mongo.ts";
import {env} from "$env/dynamic/private"
import { filterExternalRecipes, getDefaultExternalRecipes, searchExternalRecipes } from "./externalRecipesRepository.ts";
import { randomUUID } from "node:crypto";
interface RecipeDoc {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  area: string;
  ingredients: { name: string; measure?: string }[];
  instructions: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

function toRecipe(doc: RecipeDoc): Recipe {
  return {
    id: doc._id,
    source: 'community',
    title: doc.title,
    description: doc.description,
    imageUrl: doc.imageUrl,
    category: doc.category,
    area: doc.area,
    ingredients: doc.ingredients,
    instructions: doc.instructions,
    createdBy: doc.createdBy,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function toSummary(doc: RecipeDoc): RecipeSummary {
  return {
    id: doc._id,
    source: 'community',
    title: doc.title,
    imageUrl: doc.imageUrl,
    category: doc.category,
    area: doc.area,
    createdBy: doc.createdBy,
  };
}

export function normalizePageNumber(
  value: number | string | null | undefined,
): number {
  const parsed = Number(value ?? 1);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

export function paginateRecipes<T>(
  items: T[],
  pageSize: number,
  page: number,
): { items: T[]; page: number; totalPages: number; totalItems: number } {
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const safePage = Math.max(1, Math.floor(page));
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const validPage = Math.min(safePage, totalPages);
  const start = (validPage - 1) * safePageSize;
  const end = start + safePageSize;

  return {
    items: items.slice(start, end),
    page: validPage,
    totalPages,
    totalItems,
  };
}

export function mergeRecipesResults(
  externalRecipes: RecipeSummary[],
  communityRecipes: RecipeSummary[],
  page: number,
  pageSize: number,
): {
  all: RecipeSummary[];
  pageItems: RecipeSummary[];
  pageNumber: number;
  totalPages: number;
  totalItems: number;
} {
  const all = [...communityRecipes, ...externalRecipes];
  const paged = paginateRecipes(all, pageSize, page);
  return {
    all,
    pageItems: paged.items,
    pageNumber: paged.page,
    totalPages: paged.totalPages,
    totalItems: paged.totalItems,
  };
}

export async function loadRecipesData(opts:{
  search: string;
  category: string;
  area: string;
  source: 'all' | 'external' | 'community' | 'mine';
  page: number;
  limit?: number;
  createdBy?: string;
}): Promise<{
  recipes: RecipeSummary[];
  externalRecipes: RecipeSummary[];
  communityRecipes: RecipeSummary[];
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  limit: number;
  filters:{
    search: string;
    category:string;
    area: string;
    source: 'all'|'external'|'community'|'mine';
  };
}>{
  const fallbackPageSize = Number(env.DEFAULT_PAGE_SIZE) || 10;
  const limit = Math.max(1, Math.floor(opts.limit ?? (Number(env.DEFAULT_RECIPES_LIMIT) || 25)));
  const page = normalizePageNumber(opts.page);
  const source = opts.source?? 'all';

  let externalRecipes: RecipeSummary[] = [];
  let communityRecipes: RecipeSummary[] = [];

  const wantsExternal = source === 'all' || source === 'external';
  const wantsCommunity =
    source === "all" || source === "community" || source === "mine";

  if(wantsExternal){
    const hasCategoryOrArea = !!(opts.category || opts.area);

    if(hasCategoryOrArea){
      externalRecipes = await filterExternalRecipes(
        {category: opts.category || undefined, area: opts.area || undefined},
        limit*3,
      );
      if (opts.search) {
        const term = opts.search.trim().toLowerCase();
        externalRecipes = externalRecipes.filter((r) =>
          r.title.toLowerCase().includes(term),
        );
      }
      externalRecipes = externalRecipes.slice(0,limit);
    }
    else if(opts.search){
      externalRecipes = await searchExternalRecipes(opts.search,limit);
    }
    else{
      externalRecipes = await getDefaultExternalRecipes(limit);
    }
  }

  if(wantsCommunity){
    communityRecipes = await listCommunityRecipes({
      category: opts.category || undefined,
      area: opts.area || undefined,
      search: opts.search || undefined,
      createdBy: source === 'mine'? opts.createdBy : undefined,
      limit,
    })
  }

  const merged = mergeRecipesResults(
    externalRecipes,
    communityRecipes,
    page,
    fallbackPageSize,
  );

  return{
    recipes: merged.pageItems,
    externalRecipes,
    communityRecipes,
    page: merged.pageNumber,
    totalPages: merged.totalPages,
    totalItems: merged.totalItems,
    pageSize: fallbackPageSize,
    limit,
    filters: {
      search: opts.search,
      category: opts.category,
      area: opts.area,
      source,
    },
  }
}

//used to fecth the internal recipes from database
export async function listCommunityRecipes(filter? : {
  category?: string;
  area?: string;
  search?: string;
  limit?: number;
  createdBy?: string;
}): Promise<RecipeSummary[]>{
  const col = await getCollection<RecipeDoc>(COLLECTIONS.recipes);
  const query : Record<string, any> = {};
  if (filter?.category) query.category = filter.category;
  if (filter?.area) query.area = filter.area;
  if (filter?.createdBy) query.createdBy = filter.createdBy;
  if (filter?.search){
    query.title = { $regex: filter.search.trim(), $options: 'i' };
  }

  const limit = Math.max(1, Math.floor(filter?.limit ?? 25));
  const docs = await col.find(query).sort({createdAt: -1}).limit(limit).toArray();
  return docs.map(toSummary);
}

export async function getCommunityRecipeById(id: string): Promise<Recipe | null>{
  const col = await getCollection<RecipeDoc>(COLLECTIONS.recipes);
  const doc = await col.findOne({_id:id});
  return doc? toRecipe(doc) : null;
}


//used to fetch those recipes whose ids are provided
export async function getCommunityRecipeSummaries(ids: string[]): Promise<Map<string, RecipeSummary>>{
  if(ids.length == 0) return new Map();

  const col = await getCollection<RecipeDoc>(COLLECTIONS.recipes);
  const docs = await col.find({_id: {$in: ids}}).toArray();
  return new Map(docs.map(doc => [doc._id, toSummary(doc)]));
}

export async function createCommunityRecipe(input: RecipeInput, createdBy: string): Promise<Recipe>{
  const col = await getCollection<RecipeDoc>(COLLECTIONS.recipes);
  const now = new Date().toISOString();
  const doc: RecipeDoc = {
    _id: randomUUID(),
    title: input.title,
    description: input.description ?? '',
    imageUrl: input.imageUrl ?? '',
    category: input.category,
    area: input.area ?? '',
    ingredients: input.ingredients,
    instructions: input.instructions,
    createdBy,
    createdAt: now,
    updatedAt: now,
  };
  await col.insertOne(doc);
  return toRecipe(doc);
}

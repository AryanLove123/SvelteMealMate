import type { RecipeSource } from "../../lib/models/recipe.model.ts";

let favoriteKeys = $state<Set<string>>(new Set());
const favoriteSet = new Set<string>();

export function initFavorites(keys: string[]) {
  favoriteKeys = new Set<string>(keys);
}

export function favoritesSnapshot() {
  return favoriteKeys;
}

export function isFavoriteKey(
  recipeId: string,
  source: "external" | "community",
) {
  return favoriteKeys.has(`${source}:${recipeId}`);
}

export async function toggleFavorite(
  recipeId: string,
  source: RecipeSource,
  changeActive: boolean,
) {
  const key = `${source}:${recipeId}`;

  if (favoriteSet.has(key)) return;
  favoriteSet.add(key);

  const previous = new Set(favoriteKeys);

  const updated = new Set(favoriteKeys);
  if (changeActive) updated.add(key);
  else updated.delete(key);

  favoriteKeys = updated;

  try {
    if (changeActive) {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId, source }),
      });

      if (res.status == 409) {
        return;
      }
      if (!res.ok) {
        throw new Error(
          (await res.json().catch(() => null))?.message ??
            "Failed to add favorite",
        );
      }
    } else {
      const res = await fetch(
        `/api/favorites?recipeId=${encodeURIComponent(recipeId)}&source=${source}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok && res.status !== 404)
        throw new Error("Failed to remove favorite");
    }
  } catch (err) {
    favoriteKeys = previous;
  } finally {
    favoriteSet.delete(key);
  }
}

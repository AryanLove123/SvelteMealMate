import type { RecipeSource, RecipeSummary } from "../../../lib/models/recipe.model.ts";
import { getExternalRecipeById } from "../repositories/externalRecipesRepository.ts";
import { getCommunityRecipeSummaries } from "../repositories/recipesRepository.ts";

export async function resolveRecipeSummaries(refs: {recipeId: string; source: RecipeSource}[]): Promise<Map<string, RecipeSummary | null>>{
    const result = new Map<string, RecipeSummary | null>();

    const communityIds = [...new Set(refs.filter(ref => ref.source == 'community').map(ref => ref.recipeId))];
    const externalIds = [...new Set(refs.filter(ref => ref.source == 'external').map(ref => ref.recipeId))];

    const communityMap = await getCommunityRecipeSummaries(communityIds);
    for(const id of communityIds){
        result.set(`community:${id}`, communityMap.get(id) ?? null);
    }

    await Promise.all(
        externalIds.map(async id =>{
            try{
                const recipe = await getExternalRecipeById(id);
                result.set(`external:${id}`, 
                        recipe 
                        ? {
                            id: recipe.id,
                            source: 'external',
                            title: recipe.title,
                            imageUrl: recipe.imageUrl,
                            category: recipe.category,
                            area: recipe.area,
                        }
                : null);
            }
            catch {
                result.set(`external:${id}`, null);
            }
        }),
    );
    return result;
}
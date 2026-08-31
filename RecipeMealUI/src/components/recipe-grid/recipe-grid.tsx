import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { RecipeSource, UiRecipeSummary } from '../../type';
import { RecipeClickDetail } from '../recipe-card/recipe-card';
import { FavoriteToggleDetail } from '../favorite-button/favorite-button';

@Component({
  tag: 'recipe-grid',
  styleUrl: 'recipe-grid.css',
  shadow: true,
})
export class RecipeGrid {
  @Prop() recipes: UiRecipeSummary[] = [];

  /** Set of "source:id" strings that are currently favorited */
  @Prop() favorites: string[] = [];

  @Prop() loading: boolean = false;
  @Prop() showActions: boolean = false;
  @Prop() emptyMessage: string = 'Try adjusting your search or filters.';

  @Event({ eventName: 'recipe-click' }) recipeClick!: EventEmitter<RecipeClickDetail>;
  @Event({ eventName: 'favorite-toggle' }) favoriteToggle!: EventEmitter<FavoriteToggleDetail>;
  @Event({ eventName: 'recipe-edit' }) recipeEdit!: EventEmitter<RecipeClickDetail>;
  @Event({ eventName: 'recipe-delete' }) recipeDelete!: EventEmitter<RecipeClickDetail>;

  private isFavorite(id: string, source: RecipeSource) {
    return this.favorites.includes(`${source}:${id}`);
  }

  render() {
    if (this.loading) {
      return <loading-state label="Loading recipes…" />;
    }

    if (!this.recipes || this.recipes.length === 0) {
      return <empty-state heading="No recipes found" message={this.emptyMessage} icon="🔍" />;
    }

    return (
      <div class="grid">
        {this.recipes.map(recipe => (
          <recipe-card
            key={`${recipe.source}:${recipe.id}`}
            recipe={recipe}
            favorite={this.isFavorite(recipe.id, recipe.source)}
            showActions={this.showActions}
            onRecipe-click={(e: CustomEvent<RecipeClickDetail>) => this.recipeClick.emit(e.detail)}
            onFavorite-toggle={(e: CustomEvent<FavoriteToggleDetail>) => this.favoriteToggle.emit(e.detail)}
            onRecipe-edit={(e: CustomEvent<RecipeClickDetail>) => this.recipeEdit.emit(e.detail)}
            onRecipe-delete={(e: CustomEvent<RecipeClickDetail>) => this.recipeDelete.emit(e.detail)}
          />
        ))}
      </div>
    );
  }
}

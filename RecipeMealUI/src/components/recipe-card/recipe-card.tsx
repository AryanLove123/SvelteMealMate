import { Component, EventEmitter, Event, Prop, h } from '@stencil/core';
import { RecipeSource, UiRecipeSummary } from '../../type';

export interface RecipeClickDetail {
  id: string;
  source: RecipeSource;
}

export interface FavoriteToggleDetail {
  recipeId: string;
  source: RecipeSource;
  nextActive: boolean;
}

@Component({
  tag: 'recipe-card',
  styleUrl: 'recipe-card.css',
  shadow: true,
})
export class RecipeCard {
  @Prop() recipe!: UiRecipeSummary;

  @Prop() favorite: boolean = false;

  @Prop() showAuthor: boolean = true;

  @Prop() showActions: boolean = false;

  @Event({ eventName: 'recipe-click' }) recipeClick!: EventEmitter<RecipeClickDetail>;
  @Event({ eventName: 'favorite-toggle' }) favoriteToggle!: EventEmitter<FavoriteToggleDetail>;
  @Event({ eventName: 'recipe-edit' }) recipeEdit!: EventEmitter<RecipeClickDetail>;
  @Event({ eventName: 'recipe-delete' }) recipeDelete!: EventEmitter<RecipeClickDetail>;

  onCardClick = () => {
    this.recipeClick.emit({ id: this.recipe.id, source: this.recipe.source });
  };

  onFavToggle = (e: CustomEvent<FavoriteToggleDetail>) => {
    e.stopPropagation();
    this.favoriteToggle.emit(e.detail);
  };

  onEdit = (e: MouseEvent) => {
    e.stopPropagation();
    this.recipeEdit.emit({ id: this.recipe.id, source: this.recipe.source });
  };

  onDelete = (e: MouseEvent) => {
    e.stopPropagation();
    this.recipeDelete.emit({ id: this.recipe.id, source: this.recipe.source });
  };

  render() {
    const r = this.recipe;
    const badgeLabel = r.source === 'external' ? 'Public Recipe' : 'Community Recipe';

    return (
      <div class="card" onClick={this.onCardClick}>
        <div class="media">
          {r.imageUrl ? <img src={r.imageUrl} alt={r.title} loading="lazy" /> : <div class="placeholder">No image</div>}
          <span class={{ badge: true, external: r.source === 'external', community: r.source === 'community' }}>{badgeLabel}</span>
        </div>
        <div class="body">
          <h3 class="title">{r.title}</h3>
          <p class="meta">
            {r.category ? <span>{r.category}</span> : null}
            {r.area ? <span> · {r.area}</span> : null}
          </p>
          {this.showAuthor && r.source === 'community' && r.createBy ? <p class="author">Created by {r.createBy}</p> : null}
          {this.showActions ? (
            <div class="actions">
              <button type="button" class="btn edit" onClick={this.onEdit}>
                Edit
              </button>
              <button type="button" class="btn delete" onClick={this.onDelete}>
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

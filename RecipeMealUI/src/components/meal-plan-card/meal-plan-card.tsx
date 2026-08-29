import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { UiMealPlanEntry } from '../../type';

@Component({
  tag: 'meal-plan-card',
  styleUrl: 'meal-plan-card.css',
  shadow: true,
})
export class MealPlanCard {
  @Prop() entry!: UiMealPlanEntry;
  @Event({ eventName: 'meal-edit' }) mealEdit!: EventEmitter<UiMealPlanEntry>;
  @Event({ eventName: 'meal-remove' }) mealRemove!: EventEmitter<UiMealPlanEntry>;

  render() {
    const { recipe } = this.entry;

    return (
      <div class="meal-card">
        <div class="img-placeholder">{recipe.imageUrl ? <img src={recipe.imageUrl} alt={recipe.title} /> : <span class="placeholder">🍲</span>}</div>
        <div class="info">
          <p class="title">{recipe.title}</p>
          <div class={{ badge: true, external: recipe.source == 'external' }}>{recipe.source == 'external' ? 'Public' : 'Community'}</div>
        </div>
        <div class="actions">
          <button type="button" onClick={() => this.mealEdit.emit(this.entry)}>
            ✎
          </button>
          <button type="button" onClick={() => this.mealRemove.emit(this.entry)}>
            ✕
          </button>
        </div>
      </div>
    );
  }
}

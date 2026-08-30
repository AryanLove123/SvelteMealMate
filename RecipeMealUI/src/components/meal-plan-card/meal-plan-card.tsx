import { Component, Prop, Event, EventEmitter, h, State } from '@stencil/core';
import { UiMealPlanEntry } from '../../type';

@Component({
  tag: 'meal-plan-card',
  styleUrl: 'meal-plan-card.css',
  shadow: true,
})
export class MealPlanCard {
  @Prop() entry!: UiMealPlanEntry;
  @State() isExpanded = false;
  @Event({ eventName: 'meal-edit' }) mealEdit!: EventEmitter<UiMealPlanEntry>;
  @Event({ eventName: 'meal-remove' }) mealRemove!: EventEmitter<UiMealPlanEntry>;

  openPopout = (e: MouseEvent) => {
    e.stopPropagation();
    this.isExpanded = true;
  };

  closePopout = (e: MouseEvent) => {
    e.stopPropagation();
    this.isExpanded = false;
  };

  render() {
    const { recipe } = this.entry;

    return (
      <div class="meal-card">
        <div class="img-placeholder clickable" onClick={this.openPopout} title="Click to expand details">{recipe.imageUrl ? <img src={recipe.imageUrl} alt={recipe.title} /> : <span class="placeholder">🍲</span>}</div>
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

        {this.isExpanded && (
          <div class="popout-backdrop" onClick={this.closePopout}>
            <div class="popout-card" onClick={e => e.stopPropagation()}>
              <button type="button" class="popout-close" onClick={this.closePopout}>
                ✕
              </button>

              <div class="popout-image-container">
                {recipe.imageUrl ? (
                  <img src={recipe.imageUrl} alt={recipe.title} class="popout-img" />
                ) : (
                  <div class="popout-placeholder">🍲</div>
                )}
              </div>

              <div class="popout-body">
                <span class={{ 'popout-badge': true, 'external': recipe.source === 'external' }}>
                  {recipe.source === 'external' ? 'Public Recipe' : 'Community Recipe'}
                </span>

                <h3 class="popout-title">{recipe.title}</h3>

                <div class="popout-meta">
                  {recipe.category && <span class="meta-tag">🏷️ {recipe.category}</span>}
                  {recipe.area && <span class="meta-tag">🌍 {recipe.area}</span>}
                </div>

                <div class="popout-actions">
                  <button 
                    type="button" 
                    class="btn-edit" 
                    onClick={() => {
                      this.closePopout(new MouseEvent('click'));
                      this.mealEdit.emit(this.entry);
                    }}
                  >
                    ✎ Edit
                  </button>
                  <button 
                    type="button" 
                    class="btn-remove" 
                    onClick={() => {
                      this.closePopout(new MouseEvent('click'));
                      this.mealRemove.emit(this.entry);
                    }}
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

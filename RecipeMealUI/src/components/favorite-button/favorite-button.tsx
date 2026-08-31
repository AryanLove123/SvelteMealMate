import { Component, EventEmitter, Prop, Event, h } from '@stencil/core';
import { RecipeSource } from '../../type';

export interface FavoriteToggleDetail {
  recipeId: string;
  source: RecipeSource;
  changeActive: boolean;
}

@Component({
  tag: 'favorite-button',
  styleUrl: 'favorite-button.css',
  shadow: true,
})
export class FavoriteButton {
  @Prop() active: boolean = false;

  @Prop() recipeId!: string;

  @Prop() source: RecipeSource = 'external';

  @Prop() disabled: boolean = false;

  @Event({ eventName: 'favorite-toggle' }) favoriteToggle!: EventEmitter<FavoriteToggleDetail>;

  handleClick = () => {
    if (this.disabled) return;
    this.favoriteToggle.emit({
      recipeId: this.recipeId,
      source: this.source,
      changeActive: !this.active,
    });
  };

  render() {
    return (
      <button class={{ 'fav-btn': true, 'active': this.active }} onClick={this.handleClick} disabled={this.disabled} type="button">
        <span class="heart">{this.active ? '♥' : '♡'}</span>
      </button>
    );
  }
}

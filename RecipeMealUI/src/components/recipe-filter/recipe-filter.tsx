import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

export interface RecipeFilterValue {
  source: 'all' | 'external' | 'community' | 'mine';
  category: string;
  area: string;
}

@Component({
  tag: 'recipe-filter',
  styleUrl: 'recipe-filter.css',
  shadow: true,
})
export class RecipeFilterComponent {
  @Prop() source: RecipeFilterValue['source'] = 'all';
  @Prop() category: string = '';
  @Prop() area: string = '';
  @Prop() categories: string[] = [];
  @Prop() areas: string[] = [];
  @Prop() showMine: boolean = true;

  @Event({ eventName: 'filter-change' }) filterChange!: EventEmitter<RecipeFilterValue>;

   emit(partial: Partial<RecipeFilterValue>) {
    this.filterChange.emit({
      source: this.source,
      category: this.category,
      area: this.area,
      ...partial,
    });
  }

  render() {
    return (
      <div class="filters">
        <select
          aria-label="Filter by source"
          onChange={(e: Event) => this.emit({ source: (e.target as HTMLSelectElement).value as RecipeFilterValue['source'] })}
        >
          <option value="all" selected={this.source === 'all'}>All Sources</option>
          <option value="external" selected={this.source === 'external'}>Public</option>
          <option value="community" selected={this.source === 'community'}>Community</option>
          {this.showMine ? (
            <option value="mine" selected={this.source === 'mine'}>My Recipes</option>
          ) : null}
        </select>

        <select
          aria-label="Filter by category"
          onChange={(e: Event) => this.emit({ category: (e.target as HTMLSelectElement).value })}
        >
          <option value="">All Categories</option>
          {this.categories.map(c => (
            <option value={c} selected={this.category === c}>{c}</option>
          ))}
        </select>

        <select
          aria-label="Filter by area"
          onChange={(e: Event) => this.emit({ area: (e.target as HTMLSelectElement).value })}
        >
          <option value="">All Areas</option>
          {this.areas.map(a => (
            <option value={a} selected={this.area === a}>{a}</option>
          ))}
        </select>
      </div>
    );
  }
}

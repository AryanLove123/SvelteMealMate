import { Component, Prop, Event, EventEmitter, h, State, Watch } from '@stencil/core';

@Component({
  tag: 'recipe-search',
  styleUrl: 'recipe-search.css',
  shadow: true,
})
export class RecipeSearch {
  @Prop() value: string = '';
  @Prop() placeholder: string = 'Search recipes…';
  @Prop() debounce: number = 350;

  @State() internalValue: string = '';

  @Event({ eventName: 'search' }) search!: EventEmitter<string>;

  private timer?: ReturnType<typeof setTimeout>;

  componentWillLoad() {
    this.internalValue = this.value;
  }

  @Watch('value')
  onValuePropChange(newVal: string) {
    this.internalValue = newVal;
  }

  private onInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    this.internalValue = target.value;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.search.emit(this.internalValue);
    }, this.debounce);
  };

  private onSubmit = (e: Event) => {
    e.preventDefault();
    if (this.timer) clearTimeout(this.timer);
    this.search.emit(this.internalValue);
  };

  render() {
    return (
      <form class="search-form" onSubmit={this.onSubmit}>
        <span class="icon">🔍</span>
        <input
          type="search"
          value={this.internalValue}
          placeholder={this.placeholder}
          onInput={this.onInput}
          aria-label="Search recipes"
        />
      </form>
    );
  }
}

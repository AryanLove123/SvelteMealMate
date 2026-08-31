import { Component, Prop, State, Event, EventEmitter, Watch, h } from '@stencil/core';
import { UiIngredient, UiRecipeFormValue } from '../../type';

const emptyForm = (): UiRecipeFormValue => ({
  title: '',
  description: '',
  imageUrl: '',
  category: '',
  area: '',
  ingredients: [{ name: '', measure: '' }],
  instructions: '',
});

@Component({
  tag: 'recipe-form',
  styleUrl: 'recipe-form.css',
  shadow: true,
})
export class RecipeForm {
  @Prop() mode: 'create' | 'edit' = 'create';
  @Prop() submitting: boolean = false;
  @Prop() categories: string[] = [];
  @Prop() areas: string[] = [];

  // Existing recipe value when editing
  @Prop() recipe?: UiRecipeFormValue;

  @State() form: UiRecipeFormValue = emptyForm();
  @State() errors: Record<string, string> = {};

  @Event({ eventName: 'recipe-submit' }) recipeSubmit!: EventEmitter<UiRecipeFormValue>;
  @Event({ eventName: 'recipe-cancel' }) recipeCancel!: EventEmitter<void>;

  componentWillLoad() {
    this.syncForm();
  }

  @Watch('recipe')
  syncForm() {
    this.form = this.recipe
      ? {
          ...this.recipe,
          ingredients: this.recipe.ingredients.length ? [...this.recipe.ingredients] : [{ name: '', measure: '' }],
        }
      : emptyForm();
  }

  updateField<K extends keyof UiRecipeFormValue>(key: K, value: UiRecipeFormValue[K]) {
    this.form = { ...this.form, [key]: value };
  }

  addIngredient = () => {
    this.form = {
      ...this.form,
      ingredients: [...this.form.ingredients, { name: '', measure: '' }],
    };
  };

  updateIngredient(index: number, item: Partial<UiIngredient>) {
    const ingredients = this.form.ingredients.map((ing, i) => (i === index ? { ...ing, ...item } : ing));
    this.form = { ...this.form, ingredients };
  }

  removeIngredient = (index: number) => {
    const ingredients = this.form.ingredients.filter((_, i) => i != index);
    this.form = {
      ...this.form,
      ingredients: ingredients.length ? ingredients : [{ name: '', measure: '' }],
    };
  };

  validate(): boolean {
    const errors: Record<string, string> = {};
    if (!this.form.title.trim()) errors.title = 'Title is required';
    if (!this.form.category.trim()) errors.category = 'Category is required';
    if (!this.form.instructions.trim()) errors.instructions = 'Instructions are required';
    const validIngredients = this.form.ingredients.filter(i => i.name.trim());
    if (validIngredients.length === 0) errors.ingredients = 'At least one ingredient is required.';
    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  onSubmit = (e: Event) => {
    e.preventDefault();
    if (!this.validate()) return;
    const cleaned: UiRecipeFormValue = {
      ...this.form,
      ingredients: this.form.ingredients.filter(i => i.name.trim()),
    };
    this.recipeSubmit.emit(cleaned);
  };

  optionsFor(list: string[], currentValue?: string): string[] {
    if (!currentValue || list.includes(currentValue)) return list;
    return [currentValue, ...list];
  }

  render() {
    const categoryOptions = this.optionsFor(this.categories, this.form.category);
    const areaOptions = this.optionsFor(this.areas, this.form.area);
    return (
      <form onSubmit={this.onSubmit}>
        <label>
          <span>Title *</span>
          <input
            type="text"
            value={this.form.title}
            onInput={(e: Event) => {
              this.updateField('title', (e.target as HTMLInputElement).value);
            }}
          />
          {this.errors.title ? <em class="error">{this.errors.title}</em> : null}
        </label>

        <div class="row">
          <label>
            <span>Category *</span>
            <select
              onInput={(e: Event) => {
                this.updateField('category', (e.target as HTMLSelectElement).value);
              }}
            >
              <option value="" disabled selected={!this.form.category}>
                Select a category
              </option>
              {categoryOptions.map(c => (
                <option value={c} selected={c === this.form.category}>
                  {c}
                </option>
              ))}
            </select>
            {this.errors.category ? <em class="error">{this.errors.category}</em> : null}
          </label>

          <label>
            <span>Area / Cuisine</span>
            <select onInput={(e: Event) => this.updateField('area', (e.target as HTMLSelectElement).value)}>
              <option value="" selected={!this.form.area}>Select an area</option>
              {areaOptions.map(a => (
                <option value={a} selected={a === this.form.area}>
                  {a}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          <span>Image URL</span>
          <input type="text" value={this.form.imageUrl} onInput={(e: Event) => this.updateField('imageUrl', (e.target as HTMLInputElement).value)} />
        </label>

        <label>
          <span>Description</span>
          <textarea rows={2} onInput={(e: Event) => this.updateField('description', (e.target as HTMLTextAreaElement).value)}>
            {this.form.description}
          </textarea>
        </label>

        <div class="ingredients">
          <span class="label-row">Ingredients *</span>
          {this.form.ingredients.map((ing, index) => (
            <div class="ingredient-row" key={index}>
              <input
                type="text"
                placeholder="Ingredient name"
                value={ing.name}
                onInput={(e: Event) =>
                  this.updateIngredient(index, {
                    name: (e.target as HTMLInputElement).value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Measure (e.g. 2cups)"
                value={ing.measure}
                onInput={(e: Event) =>
                  this.updateIngredient(index, {
                    measure: (e.target as HTMLInputElement).value,
                  })
                }
              />

              <button type="button" class="icon-btn" onClick={() => this.removeIngredient(index)}>
                ✕
              </button>
            </div>
          ))}
          <button type="button" class="add-ingredient" onClick={this.addIngredient}>
            + Add Ingredient
          </button>

          <label>
            <span>Instructions</span>
            <textarea rows={6} onInput={(e: Event) => this.updateField('instructions', (e.target as HTMLTextAreaElement).value)}>
              {this.form.instructions}
            </textarea>
            {this.errors.instructions ? <em class="error">{this.errors.instructions}</em> : null}
          </label>

          <div class="form-actions">
            <button type="button" class="btn cancel" onClick={() => this.recipeCancel.emit()}>
              Cancel
            </button>

            <button type="submit" class="btn submit" disabled={this.submitting}>
              {this.submitting ? 'Saving' : this.mode == 'create' ? 'Create Recipe' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    );
  }
}

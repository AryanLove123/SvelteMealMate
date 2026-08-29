import { Prop, Event, Component, EventEmitter, h } from '@stencil/core';
import { UiMealPlanEntry, UiMealType } from '../../type';

export interface MealAddDetail {
  day: string;
  mealType: UiMealType;
}

const MEAL_TYPES: UiMealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

@Component({
  tag: 'meal-plan-week',
  styleUrl: 'meal-plan-week.css',
  shadow: true,
})
export class MealPlanWeek {
  @Prop() week: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  @Prop() meals: UiMealPlanEntry[] = [];

  @Event({ eventName: 'meal-add' }) mealAdd!: EventEmitter<MealAddDetail>;
  @Event({ eventName: 'meal-edit' }) mealEdit!: EventEmitter<UiMealPlanEntry>;
  @Event({ eventName: 'meal-remove' }) mealRemove!: EventEmitter<UiMealPlanEntry>;

  entriesFor(day: string, mealType: UiMealType) {
    return this.meals.filter(m => m.day === day && m.mealType === mealType);
  }

  render() {
    return (
      <div class="planner-scroll">
        <div class="planner">
          <div class="cell corner" />
          {this.week.map(day => (
            <div class="cell day-head">{day}</div>
          ))}

          {MEAL_TYPES.map(mealType => [
            <div class="cell meal-type-label">{mealType}</div>,
            ...this.week.map(day => {
              const entries = this.entriesFor(day, mealType);
              return (
                <div class="cell body-cell">
                  {entries.map(entry => (
                    <meal-plan-card
                      entry={entry}
                      onMeal-edit={(e: CustomEvent<UiMealPlanEntry>) => this.mealEdit.emit(e.detail)}
                      onMeal-remove={(e: CustomEvent<UiMealPlanEntry>) => this.mealRemove.emit(e.detail)}
                    />
                  ))}
                  <button type='button' class="add-btn" onClick={() => this.mealAdd.emit({day, mealType})}>
                    + Add
                  </button>
                </div>
              );
            }),
          ])}
        </div>
      </div>
    );
  }
}

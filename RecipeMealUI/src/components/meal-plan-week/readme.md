# meal-plan-week



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                | Default                                                                          |
| -------- | --------- | ----------- | ------------------- | -------------------------------------------------------------------------------- |
| `meals`  | --        |             | `UiMealPlanEntry[]` | `[]`                                                                             |
| `week`   | --        |             | `string[]`          | `['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']` |


## Events

| Event         | Description | Type                           |
| ------------- | ----------- | ------------------------------ |
| `meal-add`    |             | `CustomEvent<MealAddDetail>`   |
| `meal-edit`   |             | `CustomEvent<UiMealPlanEntry>` |
| `meal-remove` |             | `CustomEvent<UiMealPlanEntry>` |


## Dependencies

### Depends on

- [meal-plan-card](../meal-plan-card)

### Graph
```mermaid
graph TD;
  meal-plan-week --> meal-plan-card
  style meal-plan-week fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

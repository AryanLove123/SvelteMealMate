# meal-plan-card



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute | Description | Type              | Default     |
| -------------------- | --------- | ----------- | ----------------- | ----------- |
| `entry` _(required)_ | --        |             | `UiMealPlanEntry` | `undefined` |


## Events

| Event         | Description | Type                           |
| ------------- | ----------- | ------------------------------ |
| `meal-edit`   |             | `CustomEvent<UiMealPlanEntry>` |
| `meal-remove` |             | `CustomEvent<UiMealPlanEntry>` |


## Dependencies

### Used by

 - [meal-plan-week](../meal-plan-week)

### Graph
```mermaid
graph TD;
  meal-plan-week --> meal-plan-card
  style meal-plan-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

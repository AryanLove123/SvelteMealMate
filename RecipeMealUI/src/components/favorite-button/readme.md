# favorite-button



<!-- Auto Generated Below -->


## Properties

| Property                | Attribute   | Description | Type                        | Default      |
| ----------------------- | ----------- | ----------- | --------------------------- | ------------ |
| `active`                | `active`    |             | `boolean`                   | `false`      |
| `disabled`              | `disabled`  |             | `boolean`                   | `false`      |
| `recipeId` _(required)_ | `recipe-id` |             | `string`                    | `undefined`  |
| `source`                | `source`    |             | `"community" \| "external"` | `'external'` |


## Events

| Event             | Description | Type                                |
| ----------------- | ----------- | ----------------------------------- |
| `favorite-toggle` |             | `CustomEvent<FavoriteToggleDetail>` |


## Dependencies

### Used by

 - [recipe-card](../recipe-card)

### Graph
```mermaid
graph TD;
  recipe-card --> favorite-button
  style favorite-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# confirmation-dialog



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type      | Default                          |
| -------------- | --------------- | ----------- | --------- | -------------------------------- |
| `cancelLabel`  | `cancel-label`  |             | `string`  | `'Cancel'`                       |
| `confirmLabel` | `confirm-label` |             | `string`  | `'Delete'`                       |
| `heading`      | `heading`       |             | `string`  | `'Are you sure?'`                |
| `message`      | `message`       |             | `string`  | `'This action cannot be undone'` |
| `open`         | `open`          |             | `boolean` | `false`                          |


## Events

| Event     | Description | Type                |
| --------- | ----------- | ------------------- |
| `cancel`  |             | `CustomEvent<void>` |
| `confirm` |             | `CustomEvent<void>` |


## Dependencies

### Depends on

- [modal-dialog](../modal-dialog)

### Graph
```mermaid
graph TD;
  confirmation-dialog --> modal-dialog
  style confirmation-dialog fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# Actions

This document describes the Flux actions used in the Consus client.

> ***Note*** that all actions have an `actionId` and `timestamp` attribute courtesy of `src/lib/database.js`.

## Table of Contents

- [Actions](#actions)
    - [Table of contents](#table-of-contents)
    - [CHECKIN](#checkin)
    - [CLEAR_ALL_DATA](#clear_all_data)
    - [DELETE_ITEM](#delete_item)
    - [NEW_CHECKOUT](#new_checkout)
    - [NEW_ITEM](#new_item)
    - [NEW_MODEL](#new_model)
    - [NEW_STUDENT](#new_student)

## CHECKIN

Checks in an item for a student.

### Data

- `itemAddress`: The address of the item to check-in
- `studentId`: The ID of the student checking out the item

```json
{
    "itemAddress": "iGwEZUvfA",
    "studentId": "123456"
}
```


## CLEAR_ALL_DATA

Dispatched when _all_ data should be forgotten. For example, all items, models, errors, and students shall be deleted.

### Data

None.


## DELETE_ITEM

Deletes an item from the system.

### Data

- `itemAddress`: The address of the item to be deleted
- `modelAddress`: The model address the item belongs to

```json
{
    "itemAddress": "iGwEZUvfA",
    "modelAddress": "m8y7nEtAe"
}
```


## NEW_CHECKOUT

Checkouts items to a student.

### Data

- `adminCode`: (_Optional_) Admin override code
- `itemAddresses`: Address of the item ...
- `studentId`: The student's ID who is checking out

```json
{
    "adminCode": "1123581321",
    "itemAddresses": [ "iGwEZUvfA", "iGwEVVHHE", "iGwEZeaT" ],
    "studentId": "123456"
}
```


## NEW_ITEM

Creates a new item.

### Data

- `modelAddress`: The model's address the new item belongs to

```json
{
    "modelAddress": "m8y7nEtAe"
}
```


## NEW_MODEL

Creates a new model.

### Data

- `count`: Quantity of this model
- `description`: Description of the new model
- `faultDescription`: Description of the fault
- `isFaulty`: Fault status of the model
- `location`: Where the model is stored
- `manufacturer`: New model's manufacturer
- `name`: Name of the new model
- `price`: Unit cost of the model
- `vendor`: Where the new model came from

```json
{
    "count": 20,
    "description": "V = I*R",
    "faultDescription": "",
    "isFaulty": false,
    "location": "Shelf 14",
    "manufacturer": "Pancakes R Us",
    "name": "Resistor",
    "price": 10.5,
    "vendor": "Mouzer"
}
```


## NEW_STUDENT

Create a new student.

### Data

- `id`: The student's ID number
- `name`: The student's name

```json
{
    "id": "123456",
    "name": "John von Neumann"
}
```

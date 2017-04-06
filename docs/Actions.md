# Actions

This document describes the Flux actions used in the Consus client.

> ***Note*** that all actions have an `actionId` and `timestamp` attribute courtesy of `src/lib/database.js`.

## Table of Contents

- [Actions](#actions)
    - [Table of contents](#table-of-contents)
    - [ADD_ITEM_FAULT](#add_item_fault)
    - [CHANGE_ITEM_DUEDATE](#change_item_duedate)
    - [CHECKIN](#checkin)
    - [CHECKIN_MODELS](#checkin_models)
    - [CLEAR_ALL_DATA](#clear_all_data)
    - [DELETE_ITEM](#delete_item)
    - [EDIT_MODEL](#edit_model)
    - [INCREMENT_STOCK](#increment_stock)
    - [NEW_CHECKOUT](#new_checkout)
    - [NEW_ITEM](#new_item)
    - [NEW_LONGTERM_CHECKOUT](#new_longterm_checkout)
    - [NEW_MODEL](#new_model)
    - [NEW_STUDENT](#new_student)
    - [REMOVE_FAULT](#remove_fault)
    - [SAVE_ITEM](#save_item)
    - [SAVE_MODEL](#save_model)
    - [UPDATE_STUDENT](#update_student)

## ADD_ITEM_FAULT

Adds a fault to a specified item.

### Data

- `itemAddress`: The address of the item to check-in.
- `fault`: A JSON object containing the fault to add to the item.

```json
{
    "itemAddress": "iGwEZUvfA",
    "description": "description"
}
```

## CHANGE_ITEM_DUEDATE

Changes the due date of an item

- `itemAddress`: The address of the item to change due date for.
- `dueDate`: An ISO 8601 formatted date string.
- `studentId`: The studentId number who has the item checked out.

```json
{
    "itemAddress": "iGwEZUvfA",
    "dueDate": "1995-12-25",
    "studentId": 123456
}
```

## CHECKIN

Checks in an item for a student.

### Data

- `itemAddress`: The address of the item to check-in
- `studentId`: The ID of the student checking in the item

```json
{
    "itemAddress": "iGwEZUvfA",
    "studentId": "123456"
}
```

## CHECKIN_MODELS

Checks in models for a student.

### Data

- `modelAddress`: The address of the model to check in
- `studentId`: The ID of the student checking in the model
- `quantity`: The quantity of the model to check in

```json
{
    "modelAddress": "myxEb109",
    "studentId": "123456",
    "quantity": 5
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


## EDIT_MODEL

Updates a model to have new attributes.

### Data

- `address`: The edited model's address
- `name`: Name of the model
- `description`: Textual description of the model
- `manufacturer`: Model's manufacturer
- `vendor`: Vendor of the model
- `location`: Where the model is located
- `price`: Cost of the model
- `photo`: The model's photo encoded in base64

```json
{
    "address": "m8y7nEtAe",
    "name": "Resistor",
    "description": "V = IR",
    "manufacturer": "Pancakes R Us",
    "vendor": "Mouser",
    "location": "Shelf 14",
    "price": 10.50,
    "count": 20,
    "photo": "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
}
```

## INCREMENT_STOCK

Increment the inStock and total of the provided item

### Data

- `modelAddress`: The edited model's address

```json
{
    "address": "m8y7nEtAe",
    "name": "Resistor",
    "description": "V = IR",
    "manufacturer": "Pancakes R Us",
    "vendor": "Mouser",
    "location": "Shelf 14",
    "price": 10.50,
    "allowCheckout": "true",
    "count": 21,
    "inStock": 21,
    "photo": "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
}
```

## NEW_CHECKOUT

Checkouts items to a student.

### Data

- `adminCode`: (_Optional_) Admin override code
- `equipment`: Array of the equipment to check out
- `studentId`: The student's ID who is checking out

```json
{
    "adminCode": "1123581321",
    "equipment": [
        {
            "address": "iGwEZUvfA"
        },
        {
            "address": "myxEb109",
            "quantity": 5
        }
    ],
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


## NEW_LONGTERM_CHECKOUT

Checks out equipment and sets the equipments due date to the one provided.

### Data

- `studentId`: The student checking out
- `equipment`: The equipment to check out
- `dueDate`: The date and time the equipment is due back
- `professor`: The name of the professor for this longterm checkout

```json
{
    "studentId": 123456,
    "equipment": [
        {
            "address": "iGwEZUvfA"
        },
        {
            "address": "myxEb109",
            "quantity": 5
        }
    ],
    "dueDate": "2000-10-10T17:00",
    "professor": "Dr. Monkey"
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
- `email`: The student's new email
- `major`: The student's new major
- `status`: Whether the student is currently attending or not

```json
{
    "id": "123456",
    "name": "John von Neumann",
    "email": "nuemann@msoe.edu",
    "major": "Aircrafts underwater Engineer",
    "status": "Inactive"
}
```

## REMOVE_FAULT

Sets the item's fault state to false.

### Data

- `itemAddress`: The address of the item to update.

```json
{
    "itemAddress": "iGwEZUvfA"
}
```

## RETRIEVE_ITEM

Retrieve a saved item.

### Data

- `itemAddress`: The address of the item to retrieve

```json
{
    "itemAddress": "iGwEZUvfA"
}
```

## RETRIEVE_MODEL

Retrieve saved models.

### Data

- `studentId`: The student retrieving the model
- `modelAddress`: The address of the model to retrieve

```json
{
    "studentId": 123456,
    "itemAddress": "myxEb109"
}
```

## SAVE_ITEM

Save an item.

### Data

- `itemAddress`: The address of the item to save

```json
{
    "itemAddress": "iGwEZUvfA"
}
```

## SAVE_MODEL

Save models.

### Data

- `studentId`: The student saving the model
- `modelAddress`: The address of the model to save

```json
{
    "studentId": 123456,
    "itemAddress": "myxEb109"
}
```

## UPDATE_STUDENT

Updates a student that is already in the database.

### Data

A student object

- `id`: The student's ID number
- `name`: The student's new name
- `email`: The student's new email
- `major`: The student's new major

```json
{
    "id": "123456",
    "name": "John von Neumann",
    "email": "nuemann@msoe.edu",
    "major": "Aircrafts underwater Engineer"
}
```

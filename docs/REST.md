# REST API

This document describes the API endpoints of the Consus server.

## Table of Contents

* [rest-api](#rest-api)
    * [Table of contents](#table-of-contents)
    * [POST `/api/item`](#post-apiitem)
    * [GET `/api/item`](#get-apiitem)
    * [DELETE `api/item`](#delete-apiitem)
    * [GET `/api/item/overdue`](#get-apiitemoverdue)
    * [POST `/api/model`](#post-apimodel)
    * [PATCH `/api/model`](#patch-apimodel)
    * [GET `/api/model`](#get-apimodel)
    * [GET `/api/model/all`](#get-apimodelall)
    * [DELETE `api/model`](#delete-apimodel)
    * [GET `/api/student`](#get-apistudent)
    * [POST `/api/student`](#post-apistudent)
    * [PATCH `/api/stuendet/item`](#patch-apiitemstudent)
    * [POST `/api/checkout`](#post-apicheckout)
    * [POST `api/checkin`](#post-apicheckin)

## POST `/api/item`

Create an item.

### Parameters

* `modelAddress`: The identifier of the item's model

### Sample Response

```json
{
    "status": "success",
    "data": {
        "address": "iGwEZUvfA",
        "modelName": "Resistor"
    }
}
```

## GET `/api/item`

Retrieve an item.

### Parameters

* `id`: The item's identifier

### Sample Response

```json
{
    "status": "success",
    "data": {
        "item": {
            "address": "iGwEZUvfA",
            "modelAddress": "m8y7nEtAe",
            "status": "AVAILABLE"
        }
    }
}
```

## DELETE `/api/item`
Delete an item

### Parameters

* `itemAddress`: Address of the item to delete

### Sample Response
The entire list of items the server contains
```json
{
    "status": "success",
    "data": {
        "items": [{
            "address": "iGwEZUvfA",
            "modelAddress": "m8y7nEtAe",
            "status": "AVAILABLE"
        }],
        "modelName": "<NAME OF MODEL THE ITEM BELONGS TO>"
    }
}
```

## GET `/api/item/overdue`

Get a list of all currently overdue items.

```json
{
    "status": "success",
    "data": {
        "items": [{
            "address": "iGwEZUvfA",
            "modelAddress": "m8y7nEtAe",
            "timestamp": 123,
            "student": {
                "name": "<Student Name>",
                "id": "<StudentID>"
            }
        }]
    }
}
```

## POST `/api/model`

Create a model.

### Parameters

* `name`: The name of the model
* `description`: The description of the model
* `manufacturer`: The manufacturer of the model
* `vendor`: The vendor who sold the model
* `location`: Location where the model is stored
* `isFaulty`: Whether the model is faulty of not
* `faultDescription`: Description of the fault
* `price`: Price of one model
* `count`: Amount of this model in stock

### Sample Response

```json
{
    "status": "success",
    "data": {
        "address": "m8y7nEtAe",
        "name": "Resistor",
        "description": "V = IR",
        "manufacturer": "Live",
        "vendor": "Mouzer",
        "location": "Shelf 14",
        "isFaulty": false,
        "faultDescription": "",
        "price": 10.50,
        "count": 20
    }
}
```

## PATCH `/api/model`

Updates a model

### Parameters

Query string:
* `address`: Address of the model to update

Body:
* `name`: The new name of the model
* `description`: The new description of the model
* `manufacturer`: The new manufacturer of the model
* `vendor`: The bew vendor who sold the model
* `location`: New location where the model is stored
* `isFaulty`: Whether the model is faulty of not
* `faultDescription`: New description of the fault
* `price`: New price of one model

### Sample Request

```http
PATCH /api/model?address=m8y7nEtAe HTTP/1.1
Content-Type: application/json

{
    "name": "Resistor",
    "description": "It impedes electrons",
    "vendor": "Mouser"
}
```

### Sample Response

```json
{
    "status": "success",
    "data": {
        "address": "m8y7nEtAe",
        "name": "Resistor",
        "description": "It impedes electrons",
        "manufacturer": "Live",
        "vendor": "Mouser",
        "location": "Shelf 14",
        "isFaulty": false,
        "faultDescription": "",
        "price": 10.50,
        "count": 20
    }
}
```
## GET `/api/model`

Retrieve a model.

### Parameters

* `address`: The model's identifier

### Sample Response

```json
{
    "status": "success",
    "data": {
        "model": {
            "address": "m8y7nEtAe",
            "name": "Resistor",
            "description": "V = IR",
            "manufacturer": "Pancakes R Us",
            "vendor": "Mouzer",
            "location": "Shelf 14",
            "isFaulty": false,
            "faultDescription": "",
            "price": 10.50,
            "count": 20
        }
    }
}
```

## GET `/api/model/all`

Retrieve all models.

### Sample Response
An array containing each model and its data.
```json
{
    "status": "success",
    "data": {
        "models": [{
            "address": "m8y7nEtAe",
            "name": "Resistor",
            "description": "V = IR",
            "manufacturer": "Pancakes R Us",
            "vendor": "Mouzer",
            "location": "Shelf 14",
            "isFaulty": false,
            "faultDescription": "",
            "price": 10.50,
            "count": 20
        }]
    }
}
```

## DELETE `/api/model`

Delete a model

### Parameters

* `modelAddress`: Address of the model to delete

### Sample Response

```json
{
    "status": "success",
    "data": {
        "deletedModel": {
            "address": "m8y7nEtAe",
            "name": "Resistor",
            "description": "V = IR",
            "manufacturer": "Pancakes R Us",
            "vendor": "Mouzer",
            "location": "Shelf 14",
            "isFaulty": false,
            "faultDescription": "",
            "price": 10.50,
            "count": 20
        }
    }
}
```

## GET `/api/student`

Retrieve a student.

### Parameters

* `id`: The student's identifier

### Sample Response

```json
{
    "status": "success",
    "data": {
        "student": {
            "id": 123456,
            "name": "John von Neumann",
            "items": [
                {
                    "id": "123"
                },
                {
                    "id": "456"
                },
                {
                    "id": "789"
                }
            ],
            "email": "vonneumann@msoe.edu",
            "major": "Chemical Engineering & Mathematics"
        }
    }
}
```

## POST `/api/student`

Upload new student information based on an excel binary string.

### Parameters

* `data`: The excel file in binary string format

### Sample Response

```json
{
    "status": "success"
}
```

## PATCH `/api/student/item`

Edit an item's duedate that is checked out to a student

### Parameters

Query string:
* `studentId`: Id of the student who has the item

Body:
* `itemAddress`: The address of the item
* `date`: The new date the item is due

### Sample Response

```json
{
    "status": "success"
}
```

## POST `/api/checkout`

Submit a checkout request.

### Parameters

* `studentId`: The student's identifier
* `items`: An array of item identifiers
* `adminCode`: (_Optional_) An admin code to force the action; may return failure if admin code is not valid

### Sample Response

```json
{
    "status": "success"
}
```

## POST `/api/checkout/longterm`

Submit a checkout request and make the checkout be longterm for given date

### Parameters

* `studentId`: The student's identifier
* `items`: An array of item identifiers
* `adminCode`: (_Optional_) An admin code to force the action; may return failure if admin code is not valid
* `longtermDueDate`: Date the items are due back
* `longtermProfessor`: Professors name for validation of longterm checkout(Not used by system)

### Sample Response

```json
{
    "status": "success"
}
```

## POST `/api/checkin`

Submit a check-in request.

### Parameters

* `studentId`: The student's identifier
* `itemAddress`: The address of the item being checked in

### Sample Response

```json
{
    "status": "success",
    "data": {
        "itemAddress": "iGwEZUvfA",
        "modelName": "Resistor"
    }
}
```

# REST API

This document describes the API endpoints of the Consus server.

## Table of Contents

* [rest-api](#rest-api)
    * [Table of contents](#table-of-contents)
    * [POST `/api/item`](#post-apiitem)
    * [GET `/api/item`](#get-apiitem)
    * [DELETE `api/item`](#delete-apiitem)
    * [PATCH `/api/item/duedate`](#patch-apiitemduedate)
    * [DELETE `api/item/fault`](#delete-apiitemfault)
    * [POST `api/item/fault`](#post-apiitemfault)
    * [GET `/api/item/overdue`](#get-apiitemoverdue)
    * [POST `/api/item/retrieve`](#post-apiitemretrieve)
    * [POST `/api/item/save`](#post-apiitemsave)
    * [POST `/api/model`](#post-apimodel)
    * [PATCH `/api/model`](#patch-apimodel)
    * [PATCH `/api/model/instock`](#patch-apimodelinstock)
    * [GET `/api/model`](#get-apimodel)
    * [GET `/api/model/all`](#get-apimodelall)
    * [GET `/api/model/children`](#get-apimodelchildren)
    * [POST `/api/model/retrieve`](#post-apimodelretrieve)
    * [POST `/api/model/save`](#post-apimodelsave)
    * [DELETE `/api/model`](#delete-apimodel)
    * [GET `/api/student`](#get-apistudent)
    * [GET `/api/student/all`](#get-apistudentall)
    * [POST `/api/student`](#post-apistudent)
    * [PATCH `/api/student`](#patch-apistudent)
    * [PATCH `/api/student/rfid`](#patch-apistudentrfid)
    * [POST `/api/checkout`](#post-apicheckout)
    * [POST `/api/checkin`](#post-apicheckin)
    * [POST `/api/checkin/model`](#post-apicheckinmodel)

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
        "modelName": "Resistor",
        "isCheckedOutTo": null
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
            "status": "AVAILABLE",
            "isCheckedOutTo": 123456
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


## PATCH `/api/item/duedate`

Changes an item's due date.

### Parameters

Query String:
* `itemAddress`: Address of the item whose due date to change

Body:
* `studentId`: Student ID who has the item checked out
* `dueDate`: New due date for the item

### Sample Request

```http
PATCH /api/item/duedate?itemAddress=iGwEZUvfA HTTP/1.1
Content-Type: application/json

{
    "studentId": 123456,
    "dueDate": "2017-04-30"
}
```

### Sample Response

The edited item

```json
{
    "status": "success",
    "data": {
        "address": "iGwEZUvfA",
        "faultHistory": [],
        "isCheckedOutTo": 123456,
        "isFaulty": false,
        "modelAddress": "m8y7nEtAe",
        "status": "CHECKED_OUT",
        "timestamp": 1491170400
    }
}
```


## DELETE `/api/item/fault`

Sets the "isFaulty" field of a specified item to false

### Data

- `itemAddress`: The item to updateStudent

```json
{
    "itemAddress": "iGwEZUvfA"
}
```

## POST `/api/item/fault`

Adds a fault to a specified item.

### Data

- `itemAddress`: The address of the item to check-in.
- `fault`: A JSON object containing the fault to add to the item.

```json
{
    "itemAddress": "iGwEZUvfA",
    "fault": {
        "timestamp": 1231289,
        "description": "description"
    }
}
```

## GET `/api/item/overdue`

Get a list of all currently overdue items.

### Sample Response

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

## POST `/api/item/retrieve`

Retrieve a saved item.

### Parameters

* `itemAddress`: Address of the item to retrieve

### Sample Response

```json
{
    "status": "success"
}
```

## POST `/api/item/save`

Save an item to be retrieved later.

### Parameters

* `itemAddress`: Address of the item to save

### Sample Response

```json
{
    "status": "success"
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
* `allowCheckout`: If true, the model itself can be checked out
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
        "allowCheckout": false,
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
* `allowCheckout`: If true, the model can be checked out as if it were an item
* `price`: New price of one model
* `count`: The total amount of the model
* `changeStock`: If true, the number of models in stock is manually changed
* `inStock`: The number of models in stock
* `photo`: The model's picture encoded as base64

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
        "allowCheckout": true,
        "price": 10.50,
        "count": 20,
        "inStock": 20
        "photo": "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg="
    }
}
```

## PATCH `/api/model/instock`

Updates an unserialized model's total and instock values after adding a new one

### Parameters

* `modelAddress`: Address of the model to increment

### Sample Response

```json
{
    "status": "success",
    "data": {
        "address": "m8y7nEtAe",
        "name": "Resistor",
        "description": "V = IR",
        "manufacturer": "Pancakes R Us",
        "vendor": "Mouzer",
        "location": "Shelf 14",
        "allowCheckout": "true",
        "price": 10.50,
        "count": 21,
        "inStock:": 21
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

## GET `/api/model/children`

Retrieve a model and all items belonging to it.

### Parameters

* `modelAddress`: Address of the model to retrieve

### Sample Response
The model and an array of its items
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
        },
        "items": [{
            "address": "iGwEZUvfA",
            "modelAddress": "m8y7nEtAe",
            "status": "CHECKED_OUT"
        }]
    }
}
```

## POST `/api/model/retrieve`

Retrieve saved models.

### Parameters

* `studentID`: ID of the student retrieving models
* `itemAddress`: Address of the model to retrieve

### Sample Response

```json
{
    "status": "success"
}
```

## POST `/api/model/save`

Save models to be retrieved later.

### Parameters

* `studentID`: ID of the student saving models
* `itemAddress`: Address of the model to save

### Sample Response

```json
{
    "status": "success"
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

* `rfid`: The student's RFID identifier

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
## PATCH `/api/student/rfid`

Associate a student with an rfid

### Parameters

* `studentId`: The student's Id number

### Body

* `rfid`: The rfid number to associate with the student
### Sample Response

```json
{
    "status": "success"
}
```

## GET `/api/student/all`

Retrieve a list of all students.

### Sample Response

```json
{
    "status": "success",
    "data": [
        {
            "id": 123456,
            "name": "John von Neumann",
            "items": [],
            "email": "vonneumann@msoe.edu",
            "major": "Chemical Engineering & Mathematics"
        },
        {
            "id":111111,
            "name":"Boaty McBoatface",
            "status":"C - Current",
            "email":"mcboatfaceb@msoe.edu",
            "major":"Hyperdimensional Nautical Machines Engineering",
            "items":[
                {
                    "address":"iGwEZVeaT",
                    "modelAddress":"m8y7nFLsT",
                    "status":"CHECKED_OUT",
                    "isFaulty":false,
                    "faultDescription":"",
                    "timestamp":0
                }
            ]
        }
    ]
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

## PATCH `/api/student`

Update a student's information via a JSON object.
Note that fields that don't exist in the updated student will be maintained.

### Parameters

* `student`: A JSON object containing the ID of the student and the fields to update.

### Sample Response

```json
{
    "status":"success",
    "data":{
        "id":111111,
        "name":"string",
        "status":"C - Current",
        "email":"email",
        "major":"string",
        "items":[]
    }
}
```

## POST `/api/checkout`

Submit a checkout request.

### Parameters

* `studentId`: The student's identifier
* `equipment`: An array of equipment
* `adminCode`: (_Optional_) An admin code to force the action; may return failure if admin code is not valid

### Sample Response

```json
{
    "status": "success"
}
```

## POST `/api/checkout/longterm`

Submit a longterm checkout request.

### Parameters

* `studentId`: The student's identifier
* `equipment`: An array of equipment
* `professor`: The professor
* `dueDate`: The date that the equipment is due
* `adminCode`: (_Optional_) An admin code to force the action; may return failure if admin code is not valid

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
        "modelName": "Resistor",
        "isCheckedOutTo": 123456
    }
}
```

## POST `/api/checkin/model`

Submit a check-in request for one or more models.

### Parameters

* `studentId`: The student's identifier
* `modelAddress`: The address of the model being checked in
* `quantity`: The amount of the particular model being checked in

### Sample Response

```json
{
    "status": "success",
    "data": {
        "modelAddress": "m8y7nEtAe",
        "modelName": "Transistor",
        "quantity": 5
    }
}

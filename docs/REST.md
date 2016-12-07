# REST API

This document describes the API endpoints of the Consus server.

## Table of Contents

* [rest-api](#rest-api)
    * [Table of contents](#table-of-contents)
    * [POST `/api/item`](#post-apiitem)
    * [GET `/api/item`](#get-apiitem)
    * [POST `/api/model`](#post-apimodel)
    * [GET `/api/model`](#get-apimodel)
    * [GET `/api/model/all`](#get-apimodelall)
    * [GET `/api/student`](#get-apistudent)
    * [POST `/api/checkout`](#post-apicheckout)
    * [POST `api/checkin`](#post-apicheckin)

## POST `/api/item`

Create an item.

### Parameters

* `modelId`: The identifier of the item's model

### Sample Response

```json
{
    "status": "success",
    "data": {
        "address": "iGwEZUvfA"
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

## GET `/api/model`

Retrieve a model.

### Parameters

* `id`: The model's identifier

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
            "id": "123456",
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
            ]
        }
    }
}
```

## POST `/api/checkout`

Submit a checkout request.

### Parameters

* `studentId`: The student's identifier
* `items`: An array of item identifiers

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

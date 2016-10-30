# REST API

This document describes the API endpoints of the Consus server.

## Table of Contents

* [rest-api](#rest-api)
    * [Table of contents](#table-of-contents)
    * [POST `/api/item`](#post-apiitem)
    * [GET `/api/item`](#get-apiitem)
    * [POST `/api/model`](#post-apimodel)
    * [GET `/api/model`](#get-apimodel)
    * [GET `/api/student`](#get-apistudent)
    * [POST `/api/checkout`](#post-apicheckout)

## POST `/api/item`

Create an item.

### Parameters

* `modelId`: The identifier of the item's model

### Sample Response

```json
{
    "status": "success",
    "data": {
        "id": "123"
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
            "id": "123",
            "status": "AVAILABLE"
        }
    }
}
```

## POST `/api/model`

Create a model.

### Parameters

* `name`: The name of the model

### Sample Response

```json
{
    "status": "success",
    "data": {
        "id": "abc"
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
            "id": "abc",
            "name": "Transistor"
        }
    }
}
```

## GET `/api/model/all-models`

Retrieve all models.


### Sample Response
An array containing each model and its data.
```json
{
    "status": "success",
    "data": {
        "models": [{
            'address': 'm8y7nEtAe',
            'name': 'Resistor',
            'description': 'V = IR',
            'location': 'Shelf 14',
            'isFaulty': false,
            'faultDescription': '',
            'price': '$10.50',
            'count': 20
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

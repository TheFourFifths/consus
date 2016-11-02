# REST API

## POST `/api/item`

Create an item.

### Parameters

* `modelAddress`: The address of the item's model

### Sample Response

```json
{
    "status": "success",
    "data": {
        "address": "iGwEaCH6f"
    }
}
```

## GET `/api/item`

Retrieve an item.

### Parameters

* `address`: The item's address

### Sample Response

```json
{
    "status": "success",
    "data": {
        "item": {
            "address": "iGwEaCH6f",
            "modelAddress": "m8y7nxSMe",
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
        "address": "m8y7nxSMe"
    }
}
```

## GET `/api/model`

Retrieve a model.

### Parameters

* `address`: The model's address

### Sample Response

```json
{
    "status": "success",
    "data": {
        "model": {
            "address": "m8y7nxSMe",
            "name": "Transistor"
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
            "id": "123456",
            "name": "John von Neumann",
            "itemAddresses": [
                "iGwEaCH6f",
                "iGwEc7wMm",
                "iGwEe45y6"
            ]
        }
    }
}
```

## POST `/api/checkout`

Submit a checkout request.

### Parameters

* `studentId`: The student's identifier
* `itemAddresses`: An array of item addresses

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
    "status": "success"
}
```

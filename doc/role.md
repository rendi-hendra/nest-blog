# Role API Spec.

## Create Role

Endpoint : POST /api/roles

Role : Super Admin

Headers :

- Authorization: token

Request Body :

```json
{
  "name": "CEO"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "name": "CEO"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Get Role

Endpoint : GET /api/roles

Headers :

- Authorization: token

Response Body (Success) :

```json
{
  "data": [
    {
      "id": 1,
      "name": "Admin"
    },
    {
      "id": 2,
      "name": "Super Admin"
    }
  ]
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Update Role

Endpoint : PUT /api/roles/:roleId

Role : Super Admin

Headers :

- Authorization: token

Request Body :

```json
{
  "name": "CEO"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "name": "CEO"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Update Role User

Endpoint : PUT /api/roles/user/:userId

Role : Super Admin

Headers :

- Authorization: token

Request Body :

```json
{
  "roleId": 3
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "name": "rendi hendra",
    "email": "rendi@gmail.com",
    "roleId": 3,
    "role": "Super Admin"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Delete Role

Endpoint : DELETE /api/roles/:roleId

Role : Super Admin

Headers :

- Authorization: token

Response Body :

```json
{
  "data": true
}
```

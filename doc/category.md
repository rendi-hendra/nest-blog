# Category API Spec

## Create Category

Endpoint : POST /api/categories

Role : Admin, Super Admin

Headers :

- Authorization: token

Request Body :

```json
{
  "name": "Game"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "name": "Game"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Get Category

Endpoint : GET /api/categories

Headers :

- Authorization: token

Response Body (Success) :

```json
{
  "data": [
    {
      "id": 1,
      "name": "Komedi"
    },
    {
      "id": 2,
      "name": "Teknologi"
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

## Update Category

Endpoint : PUT /api/categories/:categoryId

Role : Admin, Super Admin

Headers :

- Authorization: token

Request Body :

```json
{
  "name": "Komedi"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "name": "Komedi"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Remove Posts

Endpoint : DELETE /api/categories/:categoryId

Role : Admin, Super Admin

Headers :

- Authorization: token

Response Body :

```json
{
  "data": true
}
```

# Profile API Spec

## Create Profile

Endpoint : POST /api/profiles

Headers :

- Authorization: token

Request Body :

```json
{
  "file": "file Profile"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "name": "profilekswuYF5e.png",
    "userId": 3
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Get User

Endpoint : GET /api/profiles/:nameProfile

Headers :

- Authorization: token

Response Body (Success) :

```json
{
  "data": "Image Profile"
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Remove Posts

Endpoint : DELETE /api/profiles

Headers :

- Authorization: token

Response Body :

```json
{
  "data": true
}
```

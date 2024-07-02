# Posts API Spec

## Create Posts

Endpoint : POST /api/posts

Headers :

- Authorization: token

Request Body :

```json
{
  "title": "Hello World",
  "body": "Hello World",
  "user_id": 1,
  "category_id": 1
}
```

Response Body :

```json
{
  "data": {
    "id": 1,
    "title": "Hello World",
    "body": "Hello World",
    "user_id": 1,
    "category_id": 1,
    "created_at": "datetime"
  }
}
```

## Get Posts

Endpoint : GET /api/posts/:postsId

Headers :

- Authorization: token

Response Body :

```json
{
  "data": {
    "id": 1,
    "title": "Rendi Hendra",
    "body": "Syahputra",
    "user_id": 1,
    "category_id": 1,
    "created_at": "datetime"
  }
}
```

## Update Posts

Endpoint : PUT /api/posts/:postsId

Headers :

- Authorization: token

Request Body :

```json
{
  "title": "Rendi Hendra",
  "body": "Syahputra"
}
```

Response Body :

```json
{
  "data": {
    "id": 1,
    "title": "Rendi Hendra",
    "body": "Syahputra"
  }
}
```

## Remove Posts

Endpoint : DELETE /api/posts/:postsId

Headers :

- Authorization: token

Response Body :

```json
{
  "data": true
}
```

## Search Posts

Endpoint : GET /api/posts

Headers :

- Authorization: token

Query Params :

- title: string, posts title, optional
- user_id: string, posts author, optional
- category_id: string, posts author, optional
- page: number, default 1
- size: number, default 10

Response Body :

```json
{
  "data": [
    {
      "id": 1,
      "title": "Rendi Hendra",
      "body": "Syahputra",
      "user_id": 1,
      "category_id": 1,
      "created_at": "datetime"
    },
    {
      "id": 2,
      "title": "Rendi Hendra",
      "body": "Syahputra",
      "user_id": 1,
      "category_id": 1,
      "created_at": "datetime"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```

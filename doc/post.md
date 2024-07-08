# Posts API Spec

## Create Posts

Endpoint : POST /api/posts

Headers :

- Authorization: token

Request Body :

```json
{
  "title": "Ini Post Pertama Aku",
  "body": "Perkenalkan nama saya Rendi hendra s.",
  "categoryId": 1
}
```

Response Body :

```json
{
  "data": {
    "id": 30,
    "title": "Ini Post Pertama Aku",
    "body": "Perkenalkan nama saya Rendi hendra s.",
    "slug": "ini-post-pertama-aku",
    "userId": 136,
    "author": "Rendi Hendra S",
    "categoryId": 1,
    "category": "Komedi",
    "createdAt": "Juli 8 2024, 4:41:01"
  }
}
```

## Get Current Posts

Endpoint : GET /api/posts/current

Headers :

- Authorization: token

Response Body :

```json
{
  "data": [
    {
      "id": 27,
      "title": "hello world",
      "body": "test",
      "slug": "hello-world",
      "userId": 135,
      "author": "test",
      "categoryId": 1,
      "category": "Komedi",
      "createdAt": "Juli 8 2024, 4:29:50"
    },
    {
      "id": 28,
      "title": "hello world",
      "body": "test",
      "slug": "hello-world-1",
      "userId": 135,
      "author": "test",
      "categoryId": 1,
      "category": "Komedi",
      "createdAt": "Juli 8 2024, 4:36:16"
    }
  ]
}
```

## Get by Slug Posts

Endpoint : GET /api/posts/slug/:slug

Headers :

- Authorization: token

Response Body :

```json
{
  "data": {
    "id": 30,
    "title": "Ini Post Pertama Aku",
    "body": "Perkenalkan nama saya Rendi hendra s.",
    "slug": "ini-post-pertama-aku",
    "userId": 136,
    "author": "Rendi Hendra S",
    "categoryId": 1,
    "category": "Komedi",
    "createdAt": "Juli 8 2024, 4:41:01"
  }
}
```

## Get by Author Posts

Endpoint : GET /api/posts/author/:author

Headers :

- Authorization: token

Response Body :

```json
{
  "data": [
    {
      "id": 30,
      "title": "Ini Post Pertama Aku",
      "body": "Perkenalkan nama saya Rendi hendra s.",
      "slug": "ini-post-pertama-aku",
      "userId": 136,
      "author": "Rendi Hendra S",
      "categoryId": 1,
      "category": "Komedi",
      "createdAt": "Juli 8 2024, 4:41:01"
    },
    {
      "id": 32,
      "title": "Ini Post Kedua Aku",
      "body": "Hallo ini post kedua saya",
      "slug": "ini-post-kedua-aku",
      "userId": 136,
      "author": "Rendi Hendra S",
      "categoryId": 1,
      "category": "Komedi",
      "createdAt": "Juli 8 2024, 9:09:38"
    }
  ]
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
- userId: string, posts author, optional
- categoryId: string, posts author, optional
- page: number, default 1
- size: number, default 10

Response Body :

```json
{
  "data": [
    {
      "id": 1,
      "title": "Hello World",
      "body": "Hello World",
      "slug": "hello-world",
      "userId": 1,
      "categoryId": 1,
      "createdAt": "datetime"
    },
    {
      "id": 2,
      "title": "Rendi Hendra",
      "body": "Syahputra",
      "slug": "Rendi-Hendra",
      "userId": 1,
      "categoryId": 1,
      "createdAt": "datetime"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```

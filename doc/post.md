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

Endpoint : PACTH /api/posts/current/:postsId

Headers :

- Authorization: token

Request Body :

```json
{
  "title": "Ini Post Kedua Aku Updated",
  "body": "Hallo ini post kedua saya Updated"
}
```

Response Body :

```json
{
  "data": {
    "id": 32,
    "title": "Ini Post Kedua Aku Updated",
    "body": "Hallo ini post kedua saya Updated",
    "slug": "ini-post-kedua-aku-updated",
    "userId": 136,
    "author": "Rendi Hendra S",
    "categoryId": 2,
    "category": "Teknologi",
    "createdAt": "Juli 8 2024, 9:09:38"
  }
}
```

## Remove Posts

Endpoint : DELETE /api/posts/current/:postsId

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
- author: string, posts author, optional
- category: string, posts category, optional
- page: number, default 1
- size: number, default 10

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
      "title": "Ini Post Kedua Aku Updated",
      "body": "Hallo ini post kedua saya Updated",
      "slug": "ini-post-kedua-aku-updated",
      "userId": 136,
      "author": "Rendi Hendra S",
      "categoryId": 2,
      "category": "Teknologi",
      "createdAt": "Juli 8 2024, 9:09:38"
    }
  ],
  "paging": {
    "current_page": 1,
    "size": 10,
    "total_page": 1
  }
}
```

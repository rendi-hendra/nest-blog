export class PostResponse {
  id: number;
  title: string;
  body: string;
  slug: string;
  userId: number;
  author: string;
  categoryId: number;
  category: string;
  createdAt: string;
  updateAt?: string;
}

export class CreatePostRequest {
  title: string;
  body: string;
  categoryId: number;
}

export class UpdatePostRequest {
  id: number;
  title?: string;
  body?: string;
  categoryId?: number;
}

export class SearchPostRequest {
  title?: string;
  author?: string;
  category?: string;
  page: number;
  size: number;
}

export class CategoryResponse {
  id: number;
  name: string;
}

export class CreateCategoryRequest {
  name: string;
}

export class UpdateCategoryRequest {
  id: number;
  name: string;
}

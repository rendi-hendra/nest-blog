export class PostResponse {
  id: number;
  title: string;
  body: string;
  slug: string;
  userId: number;
  categoryId: number;
  createdAt: Date;
}

export class CreatePostRequest {
  title: string;
  body: string;
  slug: string;
  categoryId: number;
}

// export class GetAddressRequest {
//   contact_id: number;
//   address_id: number;
// }

// export class UpdateAddressRequest {
//   id: number;
//   contact_id: number;
//   street?: string;
//   city?: string;
//   province?: string;
//   country: string;
//   postal_code: string;
// }

// export class RemoveAddressRequest {
//   contact_id: number;
//   address_id: number;
// }

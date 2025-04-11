export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  userId: {
    name: string;
  };
}

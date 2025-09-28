export type Sticker = {
  id: string;
  title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  description: string;
  tags: string[];
  category: string;
  like_count: number;
  auto_increment_id: number;
  is_favorited?: boolean;
};

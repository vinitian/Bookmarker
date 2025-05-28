interface Book {
  isbn: string;
  title: string;
  title_lowercase: string;
  description: string;
  author_list: string[];
  genre_list: string[];
  publisher: string;
  published_date: Date;
  avg_rating: number;
  total_page: number;
  img_url: string;
  rating_list: Rating[];
}

interface ShortBookData {
  book_id: string;
  title: string;
  img_url: string;
  author_list: string[];
}

interface ShortBookDataWithRating {
  book_id: string;
  title: string;
  img_url: string;
  author_list: string[];
  user_rating: number;
}

interface Rating {
  user_id: string;
  rating: number;
}

interface User {
  email: string;
  name: string;
  image: string;
  fav_list: string[];
  book_list: PersonalBook[];
}

interface PersonalBook {
  book_id: string;
  rating: number;
  cumul_time: number;
  pages_read: number;
  bookmark_list: Bookmark[];
}

interface Bookmark {
  start_time: Date;
  end_time: Date;
  total_time: number;
  start_page: number;
  end_page: number;
  total_page: number;
}

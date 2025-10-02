export interface BookDto {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  categories: string[];
  thumbnail: string | null;
  isbn13: string | null;
  isbn10: string | null;
}

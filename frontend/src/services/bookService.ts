import axios from "axios";
import type { BookDto } from "../types/BookDto.ts";


const API_URL = "http://localhost:8080/api/books";

export const searchBooks = async (query: string) => {
  const response = await axios.get<BookDto[]>(`${API_URL}/search`, {
    params: { q: query },
  });
  return response.data;
};

export const getBookById = async (id: string) => {
  const response = await axios.get<BookDto>(`${API_URL}/${id}`);
  return response.data;
};

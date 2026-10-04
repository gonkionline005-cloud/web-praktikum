import type { Book } from '../types/book'

export const books: Book[] = [
  {
    id: 'b1',
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    genre: 'Роман',
    status: 'done',
    rating: 5,
    note: 'Перечитывала уже дважды, каждый раз по-новому.',
  },
  {
    id: 'b2',
    title: '1984',
    author: 'Джордж Оруэлл',
    genre: 'Антиутопия',
    status: 'reading',
    rating: 0,
    note: 'Начала на прошлой неделе, пока середина книги.',
  },
  {
    id: 'b3',
    title: 'Гарри Поттер и философский камень',
    author: 'Джоан Роулинг',
    genre: 'Фэнтези',
    status: 'done',
    rating: 4,
    note: 'Классика, читала ещё в школе.',
  },
  {
    id: 'b4',
    title: 'Три товарища',
    author: 'Эрих Мария Ремарк',
    genre: 'Роман',
    status: 'want',
    rating: 0,
    note: 'Посоветовала подруга, пока в списке ожидания.',
  },

  {
    id: 'b5',
    title: 'Атлант расправил плечи',
    author: 'Айн Рэнд',
    genre: 'Философский роман',
    status: 'want',
    rating: 0,
    note: 'Большая книга, откладываю на каникулы.',
  },
]
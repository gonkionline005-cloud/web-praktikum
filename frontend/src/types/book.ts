export type BookStatus = 'want' | 'reading' | 'done'

export type Book = {
  id: string
  title: string
  author: string
  genre: string
  status: BookStatus
  rating: number
  note: string
}
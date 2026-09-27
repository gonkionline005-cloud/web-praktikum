import { Link } from 'react-router'
import type { Book, BookStatus } from '../types/book'

type BookCardProps = { book: Book }

const statusLabels: Record<BookStatus, string> = {
  want: 'Хочу прочитать',
  reading: 'Читаю',
  done: 'Прочитано',
}

export function BookCard({ book }: BookCardProps) {
  return (
    <article className="book-card">
      <h2>
        <Link to={`/books/${book.id}`}>{book.title}</Link>
      </h2>
      <p>Автор: {book.author}</p>
      <p>Статус: {statusLabels[book.status]}</p>
    </article>
  )
}
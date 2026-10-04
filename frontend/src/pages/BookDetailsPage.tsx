import { Link, useNavigate, useParams } from 'react-router'
import type { Book, BookStatus } from '../types/book'

type BookDetailsPageProps = {
  books: Book[]
  onDelete: (id: string) => void
}

const statusLabels: Record<BookStatus, string> = {
  want: 'Хочу прочитать',
  reading: 'Читаю',
  done: 'Прочитано',
}

export function BookDetailsPage({ books, onDelete }: BookDetailsPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const book = books.find((item) => item.id === id)

  if (!book) {
    return (
      <section>
        <h1>Книга не найдена</h1>
        <Link to="/books">К списку книг</Link>
      </section>
    )
  }

  return (
    <section>
      <h1>{book.title}</h1>
      <p>Автор: {book.author}</p>
      <p>Жанр: {book.genre}</p>
      <p>Статус: {statusLabels[book.status]}</p>
      {book.status === 'done' && book.rating > 0 && (
        <p>Оценка: {book.rating} из 5</p>
      )}
      <p>Заметка: {book.note}</p>

      <Link to={`/books/${book.id}/edit`}>Редактировать</Link>{' '}
      <button
        type="button"
        onClick={() => {
          if (window.confirm(`Удалить книгу «${book.title}»?`)) {
            onDelete(book.id)
            navigate('/books', { replace: true })
          }
        }}
      >
        Удалить
      </button>
      <p><Link to="/books">К списку книг</Link></p>
    </section>
  )
}
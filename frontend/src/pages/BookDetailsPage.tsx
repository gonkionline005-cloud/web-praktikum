import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import type { Book, BookStatus } from '../types/book'

type BookDetailsPageProps = {
  books: Book[]
  onDelete: (id: string) => Promise<void>
}

const statusLabels: Record<BookStatus, string> = {
  want: 'Хочу прочитать',
  reading: 'Читаю',
  done: 'Прочитано',
}

export function BookDetailsPage({ books, onDelete }: BookDetailsPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pending, setPending] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const book = books.find((item) => item.id === id)

  if (!book) {
    return (
      <section>
        <h1>Книга не найдена</h1>
        <Link to="/books">К списку книг</Link>
      </section>
    )
  }

  async function handleDelete(target: Book) {
    if (pending) return
    if (!window.confirm(`Удалить книгу «${target.title}»?`)) return
    try {
      setPending(true)
      setDeleteError('')
      await onDelete(target.id)
      navigate('/books', { replace: true })
    } catch (e: unknown) {
      setDeleteError(
        e instanceof Error ? e.message : 'Не удалось удалить книгу.'
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <section>
      <h1>{book.title}</h1>
      <p>Автор: {book.author}</p>
      <p>Жанр (код): {book.genre}</p>
      <p>Статус: {statusLabels[book.status]}</p>
      {book.status === 'done' && book.rating > 0 && (
        <p>Оценка: {book.rating} из 5</p>
      )}
      <p>Заметка: {book.note}</p>

      {deleteError && <p role="alert" className="form-error">{deleteError}</p>}

      <Link to={`/books/${book.id}/edit`}>Редактировать</Link>{' '}
      <button type="button" disabled={pending} onClick={() => handleDelete(book)}>
        {pending ? 'Удаляем…' : 'Удалить'}
      </button>
      <p><Link to="/books">К списку книг</Link></p>
    </section>
  )
}
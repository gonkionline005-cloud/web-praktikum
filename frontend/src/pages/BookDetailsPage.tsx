import { Link, useParams } from 'react-router'
import { books } from '../data/books'

const statusLabels: Record<string, string> = {
  want: 'Хочу прочитать',
  reading: 'Читаю',
  done: 'Прочитано',
}

export function BookDetailsPage() {
  const { id } = useParams()
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
      {book.status === 'done' && <p>Оценка: {book.rating} из 5</p>}
      <p>Заметка: {book.note}</p>
      <Link to="/books">К списку книг</Link>
    </section>
  )
}
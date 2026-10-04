import { useState } from 'react'
import { Link } from 'react-router'
import { BookCard } from '../components/BookCard'
import type { Book, BookStatus } from '../types/book'

type BooksPageProps = { books: Book[] }

export function BooksPage({ books }: BooksPageProps) {
  const [status, setStatus] = useState<BookStatus | 'all'>('all')

  const visibleBooks = books.filter(
    (book) => status === 'all' || book.status === status
  )

  return (
    <section>
      <h1>Мои книги</h1>
      <Link to="/books/new">Добавить книгу</Link>

      <div className="filter">
        <label htmlFor="status-filter">Статус:</label>
        <select
          id="status-filter"
          value={status}
          onChange={(e) => {
            const value = e.target.value
            if (
              value === 'all' ||
              value === 'want' ||
              value === 'reading' ||
              value === 'done'
            ) {
              setStatus(value)
            }
          }}
        >
          <option value="all">Все</option>
          <option value="want">Хочу прочитать</option>
          <option value="reading">Читаю</option>
          <option value="done">Прочитано</option>
        </select>
        <button type="button" onClick={() => setStatus('all')}>
          Сбросить фильтр
        </button>
      </div>

      {books.length === 0 ? (
        <p>Книг пока нет.</p>
      ) : visibleBooks.length === 0 ? (
        <p>Нет книг с выбранным статусом.</p>
      ) : (
        <div className="book-list">
          {visibleBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  )
}
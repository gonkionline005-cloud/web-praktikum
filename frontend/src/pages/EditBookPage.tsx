import { Link, useNavigate, useParams } from 'react-router'
import { BookForm } from '../components/BookForm'
import type { Book, BookDraft } from '../types/book'

type EditBookPageProps = {
  books: Book[]
  onUpdate: (id: string, draft: BookDraft) => void
}

export function EditBookPage({ books, onUpdate }: EditBookPageProps) {
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

  const initialValues: BookDraft = {
    title: book.title,
    author: book.author,
    genre: book.genre,
    status: book.status,
    rating: book.rating,
    note: book.note,
  }

  return (
    <section>
      <h1>Редактирование книги</h1>
      <BookForm
        key={book.id}
        initialValues={initialValues}
        onSave={(draft) => {
          onUpdate(book.id, draft)
          navigate(`/books/${book.id}`)
        }}
        onCancel={() => navigate(`/books/${book.id}`)}
      />
    </section>
  )
}
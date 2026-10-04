import { useNavigate } from 'react-router'
import { BookForm } from '../components/BookForm'
import type { BookDraft } from '../types/book'

type NewBookPageProps = {
  onCreate: (draft: BookDraft) => string
}

const emptyBook: BookDraft = {
  title: '',
  author: '',
  genre: '',
  status: 'want',
  rating: 0,
  note: '',
}

export function NewBookPage({ onCreate }: NewBookPageProps) {
  const navigate = useNavigate()

  function handleSave(draft: BookDraft) {
    const id = onCreate(draft)
    navigate(`/books/${id}`)
  }

  return (
    <section>
      <h1>Добавление книги</h1>
      <BookForm
        initialValues={emptyBook}
        onSave={handleSave}
        onCancel={() => navigate('/books')}
      />
    </section>
  )
}
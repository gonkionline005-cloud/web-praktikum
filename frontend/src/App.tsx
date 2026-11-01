import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import type { Book, BookDraft } from './types/book'
import * as booksApi from './services/books'
import { useAuth } from './hooks/useAuth'
import { AppLayout } from './app/AppLayout'
import { RequireAuth } from './components/RequireAuth'
import { BooksGate } from './components/BooksGate'
import type { BooksLoad } from './components/BooksGate'
import { AuthPage } from './pages/AuthPage'
import { BooksPage } from './pages/BooksPage'
import { BookDetailsPage } from './pages/BookDetailsPage'
import { NewBookPage } from './pages/NewBookPage'
import { EditBookPage } from './pages/EditBookPage'
import { NotFoundPage } from './pages/NotFoundPage'
import './App.css'

export default function App() {
  const auth = useAuth()
  const userId = auth.status === 'authenticated' ? auth.session.user.id : null

  const [store, setStore] = useState<{ userId: string | null; items: Book[] }>({
    userId: null,
    items: [],
  })
  const [load, setLoad] = useState<BooksLoad>({ status: 'idle' })
  const [attempt, setAttempt] = useState(0)

  // Список принадлежит конкретному пользователю: чужой не показываем ни на миг
  const books: Book[] =
    userId !== null && store.userId === userId ? store.items : []

  useEffect(() => {
    let active = true

    if (auth.status === 'checking') {
      // ждём окончания проверки сессии
    } else if (userId === null) {
      setStore({ userId: null, items: [] })
      setLoad({ status: 'idle' })
    } else {
      setLoad({ status: 'loading' })
      booksApi
        .getBooks()
        .then((items) => {
          if (!active) return
          setStore({ userId, items })
          setLoad({ status: 'ready' })
        })
        .catch((error: unknown) => {
          if (!active) return
          setLoad({
            status: 'error',
            message:
              error instanceof Error
                ? error.message
                : 'Не удалось загрузить книги.',
          })
        })
    }

    return () => {
      active = false
    }
  }, [auth.status, userId, attempt])

  async function refresh() {
    try {
      const items = await booksApi.getBooks()
      setStore({ userId, items })
    } catch (error: unknown) {
      setLoad({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Не удалось обновить список книг.',
      })
    }
  }

  async function createBook(draft: BookDraft): Promise<string> {
    const created = await booksApi.createBook(draft)
    await refresh()
    return created.id
  }

  async function updateBook(id: string, draft: BookDraft): Promise<void> {
    await booksApi.updateBook(id, draft)
    await refresh()
  }

  async function deleteBook(id: string): Promise<void> {
    await booksApi.deleteBook(id)
    await refresh()
  }

  return (
    <Routes>
      <Route element={<AppLayout auth={auth} />}>
        <Route index element={<Navigate to="/books" replace />} />
        <Route path="auth" element={<AuthPage auth={auth} />} />

        <Route element={<RequireAuth auth={auth} />}>
          <Route
            element={
              <BooksGate load={load} onRetry={() => setAttempt((n) => n + 1)} />
            }
          >
            <Route path="books" element={<BooksPage books={books} />} />
            <Route
              path="books/new"
              element={<NewBookPage onCreate={createBook} />}
            />
            <Route
              path="books/:id"
              element={<BookDetailsPage books={books} onDelete={deleteBook} />}
            />
            <Route
              path="books/:id/edit"
              element={<EditBookPage books={books} onUpdate={updateBook} />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
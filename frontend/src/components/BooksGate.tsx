import { Outlet } from 'react-router'

export type BooksLoad =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready' }

export function BooksGate({
  load,
  onRetry,
}: {
  load: BooksLoad
  onRetry: () => void
}) {
  if (load.status === 'error') {
    return (
      <section>
        <p role="alert">{load.message}</p>
        <button type="button" onClick={onRetry}>Повторить</button>
      </section>
    )
  }
  if (load.status !== 'ready') {
    return <p role="status">Загружаем книги…</p>
  }
  return <Outlet />
}
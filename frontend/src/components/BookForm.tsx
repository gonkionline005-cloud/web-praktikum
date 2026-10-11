import { useState } from 'react'
import type { FormEvent } from 'react'
import type { BookDraft, BookStatus } from '../types/book'
import { useGenres } from '../hooks/useGenres'

type BookFormProps = {
  initialValues: BookDraft
  onSave: (draft: BookDraft) => void
  onCancel: () => void
}

type FormState = {
  title: string
  author: string
  genre: string
  status: BookStatus
  rating: string
  note: string
}

export function BookForm(props: BookFormProps) {
  const [draft, setDraft] = useState<FormState>(() => ({
    title: props.initialValues.title,
    author: props.initialValues.author,
    genre: props.initialValues.genre,
    status: props.initialValues.status,
    rating:
      props.initialValues.rating > 0 ? String(props.initialValues.rating) : '',
    note: props.initialValues.note,
  }))
  const [error, setError] = useState('')

  const { load, retry } = useGenres()
  const genres = load.status === 'success' ? load.data : []
  const selectedGenreExists = genres.some((genre) => genre.id === draft.genre)
  const canSave = load.status === 'success' && selectedGenreExists

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSave) {
      setError('Дождитесь справочника и выберите доступный жанр.')
      return
    }

    const title = draft.title.trim()
    if (title.length < 3 || title.length > 100) {
      setError('Название должно содержать от 3 до 100 символов.')
      return
    }

    const author = draft.author.trim()
    if (!author) {
      setError('Укажите автора книги.')
      return
    }

    // Предметная проверка: оценка от 1 до 5 либо не задана
    let rating = 0
    const ratingText = draft.rating.trim()
    if (ratingText !== '') {
      const parsed = Number(ratingText)
      if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
        setError('Оценка должна быть целым числом от 1 до 5 или пустой.')
        return
      }
      rating = parsed
    }

    setError('')
    props.onSave({
      title,
      author,
      genre: draft.genre,
      status: draft.status,
      rating,
      note: draft.note.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="book-title">Название</label>
      <input
        id="book-title"
        value={draft.title}
        required
        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
      />

      <label htmlFor="book-author">Автор</label>
      <input
        id="book-author"
        value={draft.author}
        required
        onChange={(e) => setDraft({ ...draft, author: e.target.value })}
      />

      <label htmlFor="book-genre">Жанр</label>
      <select
        id="book-genre"
        value={draft.genre}
        required
        disabled={load.status !== 'success' || genres.length === 0}
        onChange={(e) => setDraft({ ...draft, genre: e.target.value })}
      >
        <option value="">Выберите жанр</option>
        {draft.genre !== '' && !selectedGenreExists && (
          <option value={draft.genre} disabled>
            Текущий код: {draft.genre} — выберите доступный жанр
          </option>
        )}
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      {load.status === 'loading' && <p role="status">Загружаем жанры…</p>}

      {load.status === 'error' && (
        <div>
          <p role="alert">{load.message}</p>
          <button type="button" onClick={retry}>Повторить</button>
        </div>
      )}

      {load.status === 'success' && genres.length === 0 && (
        <div>
          <p role="status">Жанров пока нет. Сохранение недоступно.</p>
          <button type="button" onClick={retry}>Повторить</button>
        </div>
      )}

      {load.status === 'success' && genres.length > 0 &&
        draft.genre !== '' && !selectedGenreExists && (
          <p role="alert">
            Прежний жанр не найден в справочнике. Выберите доступный жанр.
          </p>
        )}

      <label htmlFor="book-status">Статус</label>
      <select
        id="book-status"
        value={draft.status}
        onChange={(e) => {
          const status = e.target.value
          if (status === 'want' || status === 'reading' || status === 'done') {
            setDraft({ ...draft, status })
          }
        }}
      >
        <option value="want">Хочу прочитать</option>
        <option value="reading">Читаю</option>
        <option value="done">Прочитано</option>
      </select>

      <label htmlFor="book-rating">Оценка (1–5, можно оставить пустой)</label>
      <input
        id="book-rating"
        inputMode="numeric"
        value={draft.rating}
        onChange={(e) => setDraft({ ...draft, rating: e.target.value })}
      />

      <label htmlFor="book-note">Заметка</label>
      <textarea
        id="book-note"
        value={draft.note}
        onChange={(e) => setDraft({ ...draft, note: e.target.value })}
      />

      {error && <p role="alert" className="form-error">{error}</p>}

      <button type="submit" disabled={!canSave}>Сохранить</button>
      <button type="button" onClick={props.onCancel}>Отмена</button>
    </form>
  )
}
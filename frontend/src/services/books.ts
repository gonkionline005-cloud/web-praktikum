import { supabase } from '../lib/supabase'
import type { Book, BookDraft } from '../types/book'

type BookRow = {
  id: string
  owner_id: string
  genre_id: string
  title: string
  author: string
  status: Book['status']
  rating: number | null
  note: string
  created_at: string
}

const bookColumns = 'id, owner_id, genre_id, title, author, status, rating, note, created_at'

function fromRow(row: BookRow): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    genre: row.genre_id,
    status: row.status,
    rating: row.rating ?? 0,
    note: row.note,
  }
}

function toWrite(draft: BookDraft) {
  return {
    genre_id: draft.genre,
    title: draft.title.trim(),
    author: draft.author.trim(),
    status: draft.status,
    rating: draft.rating > 0 ? draft.rating : null,
    note: draft.note.trim(),
  }
}

export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select(bookColumns)
    .order('created_at', { ascending: false })
    .overrideTypes<BookRow[], { merge: false }>()

  if (error) throw new Error(`Не удалось загрузить книги: ${error.message}`)
  return data.map(fromRow)
}

export async function createBook(draft: BookDraft): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .insert(toWrite(draft))
    .select(bookColumns)
    .single()
    .overrideTypes<BookRow, { merge: false }>()

  if (error) throw new Error(`Не удалось создать книгу: ${error.message}`)
  return fromRow(data)
}

export async function updateBook(id: string, draft: BookDraft): Promise<void> {
  const { error } = await supabase
    .from('books')
    .update(toWrite(draft))
    .eq('id', id)

  if (error) throw new Error(`Не удалось изменить книгу: ${error.message}`)
}

export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase.from('books').delete().eq('id', id)

  if (error) throw new Error(`Не удалось удалить книгу: ${error.message}`)
}
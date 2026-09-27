import { Link } from 'react-router'

export function NewBookPage() {
  return (
    <section>
      <h1>Добавление книги</h1>
      <p>Форма добавления книги появится в следующей лабораторной работе.</p>
      <Link to="/books">К списку книг</Link>
    </section>
  )
}
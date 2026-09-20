import './App.css'

const appTitle: string = 'Личная библиотека'

export default function App() {
  return (
    <main className="app">
      <header>
        <h1>{appTitle}</h1>
        <p>Книги, статусы чтения и заметки.</p>
      </header>
      <section aria-labelledby="items-title">
        <h2 id="items-title">Мои книги</h2>
        <p>Здесь появится список ваших книг.</p>
      </section>
    </main>
  )
}
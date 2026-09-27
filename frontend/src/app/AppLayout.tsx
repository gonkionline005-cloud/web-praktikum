import { NavLink, Outlet } from 'react-router'

export function AppLayout() {
  return (
    <div className="app">
      <header>
        <p className="app-title">Личная библиотека</p>
        <nav aria-label="Основная навигация">
          <NavLink to="/books" end>Книги</NavLink>
          <NavLink to="/books/new">Добавить</NavLink>
        </nav>
      </header>
      <main><Outlet /></main>
    </div>
  )
}
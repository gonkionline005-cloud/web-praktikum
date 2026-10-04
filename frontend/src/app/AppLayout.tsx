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
        <p className="storage-note">
          Данные хранятся только в памяти: после обновления страницы вернутся
          демонстрационные книги.
        </p>
      </header>
      <main><Outlet /></main>
    </div>
  )
}
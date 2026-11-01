import { useState } from 'react'
import { NavLink, Outlet } from 'react-router'
import { supabase } from '../lib/supabase'
import type { AuthState } from '../hooks/useAuth'

export function AppLayout({ auth }: { auth: AuthState }) {
  const [signOutError, setSignOutError] = useState('')

  async function handleSignOut() {
    setSignOutError('')
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) setSignOutError(error.message)
  }

  return (
    <div className="app">
      <header>
        <p className="app-title">Личная библиотека</p>
        <nav aria-label="Основная навигация">
          {auth.status === 'authenticated' && (
            <>
              <NavLink to="/books" end>Книги</NavLink>
              <NavLink to="/books/new">Добавить</NavLink>
            </>
          )}
          {auth.status === 'guest' && <NavLink to="/auth">Войти</NavLink>}
        </nav>
        {auth.status === 'authenticated' && (
          <p className="auth-bar">
            {auth.session.user.email}{' '}
            <button type="button" onClick={handleSignOut}>Выйти</button>
          </p>
        )}
        {signOutError && <p role="alert" className="form-error">{signOutError}</p>}
      </header>
      <main><Outlet /></main>
    </div>
  )
}
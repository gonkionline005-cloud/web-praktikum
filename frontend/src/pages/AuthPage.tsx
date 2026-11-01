import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { supabase } from '../lib/supabase'
import type { AuthState } from '../hooks/useAuth'

type Mode = 'login' | 'register'

export function AuthPage({ auth }: { auth: AuthState }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const from = (location.state as { from?: string } | null)?.from
  const target = from && from.startsWith('/') && from !== '/auth' ? from : '/books'

  if (auth.status === 'authenticated') {
    return <Navigate to={target} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setError('')
    setMessage('')

    if (!email.trim()) {
      setError('Укажите email.')
      return
    }
    if (mode === 'register' && password.length < 8) {
      setError('Пароль должен содержать не менее 8 символов.')
      return
    }
    if (mode === 'login' && !password) {
      setError('Введите пароль.')
      return
    }

    try {
      setPending(true)
      if (mode === 'register') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        })
        if (signUpError) throw signUpError
        if (data.session) {
          navigate(target, { replace: true })
        } else {
          setMessage('Проверьте почту и подтвердите регистрацию, затем войдите.')
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (signInError) throw signInError
        navigate(target, { replace: true })
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Не удалось выполнить запрос.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section>
      <h1>{mode === 'login' ? 'Вход' : 'Регистрация'}</h1>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="auth-password">Пароль</label>
        <input
          id="auth-password"
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p role="alert" className="form-error">{error}</p>}
        {message && <p role="status">{message}</p>}

        <button type="submit" disabled={pending}>
          {pending ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setError('')
            setMessage('')
          }}
        >
          {mode === 'login' ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Вход'}
        </button>
      </form>
    </section>
  )
}
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useRegister } from '../hooks/useAuth'
import { useToast } from '../components/ui/Toast'

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const register = useRegister()
  const navigate = useNavigate()
  const toast = useToast()

  const validate = () => {
    const e: Record<string, string> = {}
    if (!email) e.email = 'Введите email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Некорректный email'
    if (!username.trim()) e.username = 'Введите имя пользователя'
    if (!password) e.password = 'Введите пароль'
    else if (password.length < 6) e.password = 'Минимум 6 символов'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await register.mutateAsync({ email, username, password })
      navigate('/dashboard')
      toast.success('Аккаунт создан!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка регистрации')
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#f7f6f2] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#01696f] mb-4">
            <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
              <rect x="4" y="6" width="20" height="3" rx="1.5" fill="white"/>
              <rect x="4" y="13" width="15" height="2.5" rx="1.25" fill="white"/>
              <rect x="4" y="19" width="17" height="2.5" rx="1.25" fill="white"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#28251d]">Создать аккаунт</h1>
          <p className="text-sm text-[#7a7974] mt-1">Начните планировать уже сегодня</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(40,37,29,0.08),0_8px_24px_rgba(40,37,29,0.06)] p-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Имя пользователя"
              placeholder="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              error={errors.username}
              autoComplete="username"
            />
            <Input
              label="Пароль"
              type="password"
              placeholder="Минимум 6 символов"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="new-password"
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={register.isPending}
            >
              Создать аккаунт
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[#7a7974] mt-4">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-[#01696f] font-medium hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}

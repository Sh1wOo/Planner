import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router"
import { gsap } from "gsap"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { useLogin } from "../hooks/useAuth"
import { useToast } from "../components/ui/Toast"
import bgImage from "../assets/background.jpeg"
import logo from "../assets/logo.jpg"

export function LoginPage() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [errors, setErrors] = useState<Record<string, string>>({})
	const login = useLogin()
	const navigate = useNavigate()
	const toast = useToast()
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.fromTo(
				".bg-image",
				{ scale: 1.06, opacity: 0 },
				{ scale: 1, opacity: 1, duration: 1.4, ease: "power3.out" },
			)
			gsap.fromTo(
				".reveal-item",
				{ y: 24, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 0.9,
					stagger: 0.08,
					ease: "power4.out",
					delay: 0.15,
				},
			)
		}, containerRef)

		return () => ctx.revert()
	}, [])

	const validate = () => {
		const e: Record<string, string> = {}
		if (!email) e.email = "Введите email"
		if (!password) e.password = "Введите пароль"
		setErrors(e)
		return Object.keys(e).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validate()) return

		try {
			await login.mutateAsync({ email, password })
			navigate("/dashboard")
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Ошибка входа")
		}
	}

	return (
		<div
			ref={containerRef}
			className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d0c0b] px-4 text-white'
		>
			<div className='absolute inset-0 z-0'>
				<img
					src={bgImage}
					alt='Background'
					className='bg-image h-full w-full object-cover'
				/>
				<div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(15,11,10,0.42)_0%,rgba(15,11,10,0.30)_35%,rgba(8,7,6,0.88)_100%)]' />
			</div>

			<div className='relative z-10 w-full max-w-110'>
				<div className='rounded-4xl border border-white/10 bg-white/8 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl'>
					<div className='rounded-[28px] border border-white/10 bg-[rgba(18,16,14,0.72)] px-6 py-7 sm:px-7'>
						<div className='reveal-item mb-8 flex items-center gap-3'>
							<div className='flex h-15 w-15 items-center justify-center rounded-2xl text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]'>
								<img
									src={logo}
									alt='logo'
                  className="h-15 w-15 rounded-2xl"
								/>
							</div>

							<div className='text-left'>
								<p className='text-sm font-semibold text-white'>
									Planner
								</p>
								<p className='text-xs text-white/45'>
									Фокусируйтесь на важном
								</p>
							</div>
						</div>

						<div className='mb-8 text-center'>
							<h1 className='reveal-item text-3xl font-semibold tracking-[-0.04em] text-white'>
								Добро пожаловать
							</h1>
							<p className='reveal-item mt-2 text-sm text-white/55'>
								Войдите в аккаунт для продолжения
							</p>
						</div>

						<form
							onSubmit={handleSubmit}
							className='reveal-item space-y-3'
							noValidate
						>
							<Input
								label='Email'
								type='email'
								placeholder='you@example.com'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								error={errors.email}
								autoComplete='email'
								className='border-white/10 bg-white/5 text-white placeholder:text-white/30'
							/>

							<Input
								label='Пароль'
								type='password'
								placeholder='••••••••'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								error={errors.password}
								autoComplete='current-password'
								className='border-white/10 bg-white/5 text-white placeholder:text-white/30'
							/>

							<div className='pt-2'>
								<Button
									type='submit'
									className='h-12 w-full'
									loading={login.isPending}
								>
									Войти
								</Button>
							</div>
						</form>

						<p className='reveal-item mt-6 text-center text-sm text-white/50'>
							Нет аккаунта?{" "}
							<Link
								to='/register'
								className='font-medium text-white transition-colors hover:text-[#d7c8b5]'
							>
								Зарегистрироваться
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

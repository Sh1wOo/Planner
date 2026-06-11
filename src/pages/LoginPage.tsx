import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { gsap } from "gsap";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useLogin } from "../hooks/useAuth";
import { useToast } from "../components/ui/Toast";
import bgImage from "../assets/background.jpeg";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const login = useLogin();
  const navigate = useNavigate();
  const toast = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bg-image",
        { scale: 1.06, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: "power3.out" },
      );
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
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "Введите email";
    if (!password) e.password = "Введите пароль";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login.mutateAsync({ email, password });
      navigate("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка входа");
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen flex items-center justify-center overflow-hidden bg-[#0d0c0b] text-white"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Background"
          className="bg-image h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,11,10,0.45)_0%,rgba(15,11,10,0.28)_35%,rgba(8,7,6,0.88)_100%)] backdrop-blur-[3px]" />
      </div>

          <div className="z-10 flex w-full max-w-md flex-col justify-center px-6 py-10">
        <div className="mb-20 text-center">
          <h1 className="reveal-item text-3xl font-light tracking-[-0.03em] text-white">
            Добро пожаловать
          </h1>
          <p className="reveal-item mt-2 text-sm text-white/50">
            Войдите в аккаунт для продолжения
          </p>
        </div>

        <div className="reveal-item ">
          <form onSubmit={handleSubmit} className="flex gap-2 flex-col p-10" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
              className="bg-white/5 text-white"
            />
            <Input
              label="Пароль"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
              className="bg-white/5 text-white"
            />
            <Button
              type="submit"
              className="w-full"
              // size="lg"
              loading={login.isPending}
            >
              Войти
            </Button>
          </form>
        </div>

        <p className="reveal-item mt-8 text-center text-sm text-white/50">
          Нет аккаунта?{" "}
          <Link
            to="/register"
            className="border-b border-white/20 pb-0.5 font-medium text-white transition-colors hover:border-[#d4c6b3]/50 hover:text-[#d4c6b3]"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}

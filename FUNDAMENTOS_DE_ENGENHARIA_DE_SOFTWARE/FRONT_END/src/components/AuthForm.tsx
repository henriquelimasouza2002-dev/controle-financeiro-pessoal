"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData.entries())),
      headers: { "Content-Type": "application/json" },
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({ message: "Erro ao autenticar." }));
      setError(data.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="auth-card">
      <div className="auth-tabs">
        <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">
          Entrar
        </button>
        <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")} type="button">
          Cadastrar
        </button>
      </div>

      <form className="form-grid" onSubmit={submit}>
        {mode === "register" && (
          <label>
            Nome
            <input name="name" placeholder="Seu nome" required />
          </label>
        )}
        <label>
          E-mail
          <input name="email" placeholder="voce@email.com" required type="email" />
        </label>
        <label>
          Senha
          <input minLength={6} name="password" placeholder="Minimo 6 caracteres" required type="password" />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="primary-button" disabled={loading} type="submit">
          {loading ? "Processando..." : mode === "login" ? "Acessar dashboard" : "Criar conta"}
        </button>
      </form>
      <p className="notice" style={{ marginTop: 14 }}>
        Demo: demo@financas.com / 123456 apos executar o seed.
      </p>
    </div>
  );
}

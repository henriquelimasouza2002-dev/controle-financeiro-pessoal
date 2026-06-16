import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="main hero">
      <section>
        <h1>Controle Financeiro Pessoal</h1>
        <p>
          Organize receitas e despesas, acompanhe categorias, visualize graficos e gere relatorios para analisar sua
          vida financeira em um unico ambiente.
        </p>
      </section>
      <AuthForm />
    </main>
  );
}

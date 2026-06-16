import { redirect } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { CategoryManager } from "@/components/CategoryManager";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    include: { _count: { select: { transactions: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <AppNav userName={user.name} />
      <main className="main">
        <div className="page-title">
          <div>
            <h1>Categorias</h1>
            <p>Crie, liste, edite e exclua categorias.</p>
          </div>
        </div>
        <CategoryManager categories={categories} />
      </main>
    </>
  );
}

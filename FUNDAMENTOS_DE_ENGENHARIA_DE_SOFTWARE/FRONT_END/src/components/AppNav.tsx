import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

export function AppNav({ userName }: { userName: string }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/dashboard">
          <strong>Controle Financeiro</strong>
          <span>{userName}</span>
        </Link>
        <nav className="nav">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/transactions">Transacoes</Link>
          <Link href="/categories">Categorias</Link>
          <Link href="/reports">Relatorios</Link>
          <Link href="/user">Usuario</Link>
          <LogoutButton />
        </nav>
      </header>
    </div>
  );
}

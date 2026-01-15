/** App layout. */

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tag from "../../shared/components/Tag.jsx";
import { safeFetchMe } from "../../shared/lib/auth.js";
import { clearSession, getCurrentUser, getAuthToken, setCurrentUser } from "../../shared/lib/storage.jsx";

function UserIcon() {
  /** Render user icon. */
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4m0 2c-4.42 0-8 2-8 4.5V21h16v-2.5C20 16 16.42 14 12 14"
      />
    </svg>
  );
}

export default function AppLayout({ children }) {
  /** Render app layout. */
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const token = useMemo(() => getAuthToken(), []);

  useEffect(() => {
    let cancelled = false;

    async function hydrateUser() {
      /** Hydrate current user. */
      if (!token) return;
      if (user?.username) return;

      const me = await safeFetchMe();
      if (!cancelled && me) {
        setCurrentUser(me);
        setUser(me);
      }
    }

    hydrateUser();
    return () => {
      cancelled = true;
    };
  }, [token, user]);

  function handleLogout() {
    /** Handle logout. */
    clearSession();
    navigate("/auth?mode=login");
  }

  return (
    <div className="page page--app">
      <header className="appTopbar">
        <div className="appTopbar__left" role="button" tabIndex={0} onClick={() => navigate("/")}>
          <div className="logoMark">M</div>
          <div className="logoText">MailOps</div>
        </div>

        <div className="appTopbar__center">
          <span className="muted">Bem-vindo,</span>{" "}
          <strong>{user?.username || "Usuário"}</strong>
          <span className="appTopbar__sep" />
          <Tag variant="neutral">AI</Tag>
        </div>

        <div className="appTopbar__right">
          <button className="iconCircle" type="button" onClick={() => navigate("/app/profile")}>
            <UserIcon />
          </button>
          <button className="btn btn--ghost" type="button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      <main className="main">{children}</main>
    </div>
  );
}

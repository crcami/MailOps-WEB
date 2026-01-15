/** Auth layout. */

export default function AuthLayout({ children }) {
  /** Render auth layout. */
  return (
    <div className="page page--auth">
      <main className="main main--center">{children}</main>
    </div>
  );
}

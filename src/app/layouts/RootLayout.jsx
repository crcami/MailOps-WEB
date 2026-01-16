import { Outlet } from "react-router-dom";
import SessionTimeout from "../../shared/components/SessionTimeout.jsx";

export default function RootLayout() {
  return (
    <>
      <SessionTimeout />
      <Outlet />
    </>
  );
}

import { Link } from "@tanstack/react-router";
import { Icons } from "./Icons";

export default function MainNav() {
  return (
    <div className="hidden md:flex">
      <Link to="/" className="flex items-center gap-2">
        <span className="hidden font-bold lg:inline-block">
          Vote Monitor | Commit Global
        </span>
      </Link>
    </div>
  );
}

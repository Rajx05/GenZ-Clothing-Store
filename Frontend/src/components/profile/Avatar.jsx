import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export const getInitials = (username) =>
  (username || "U")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

export default function Avatar({ user, size = "md" }) {
  const isVerified = Boolean(user?.verified);
  const isLarge = size === "lg";
  return (
    <div className="relative shrink-0">
      <div
        className={`rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center font-display font-bold text-brand-700 dark:text-brand-400 ${
          isLarge ? "w-16 h-16 text-xl" : "w-10 h-10 text-sm"
        }`}
      >
        {getInitials(user?.name || user?.username)}
      </div>
      {isVerified && (
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-gray-900">
          <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
        </div>
      )}
    </div>
  );
}

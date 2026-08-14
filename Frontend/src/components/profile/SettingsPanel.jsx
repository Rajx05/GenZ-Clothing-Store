import { useState } from "react";
import { motion } from "framer-motion";

const spring = { type: "spring", stiffness: 260, damping: 24 };

export default function SettingsPanel({ user, onSaved }) {
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {};
    if (!username.trim()) nextErrors.username = "Username is required";
    if (!email.trim()) nextErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email.trim()))
      nextErrors.email = "Enter a valid email address";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      onSaved(null);
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem("abc-users") || "[]");
      const idx = users.findIndex(
        (u) => u.email === user?.email || u.username === user?.username,
      );
      const stored = idx > -1 ? users[idx] : {};
      const updatedUser = {
        username: username.trim(),
        email: email.trim(),
        verified: user?.verified ?? stored.verified,
      };

      const updatedUsers = [...users];
      if (idx > -1) updatedUsers[idx] = { ...stored, ...updatedUser };
      else updatedUsers.push(updatedUser);

      localStorage.setItem("abc-users", JSON.stringify(updatedUsers));
      localStorage.setItem("abc-user", JSON.stringify(updatedUser));
      onSaved(updatedUser);
    } catch {
      onSaved(null);
    }
  };

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border ${
      errors[field] ? "border-red-500" : "border-gray-200 dark:border-gray-700"
    } focus:ring-2 focus:ring-brand-500 outline-none text-sm text-gray-900 dark:text-white transition`;

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-lg space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-semibold uppercase">
          ACCOUNT SETTINGS
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
          Profile Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          Update your username and contact email. Changes save instantly.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.05 }}
        className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 shadow-sm space-y-5"
      >
        <div>
          <label
            htmlFor="profile-username"
            className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
          >
            Username
          </label>
          <input
            id="profile-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputCls("username")}
          />
          {errors.username && (
            <p className="text-xs text-red-500 mt-1 font-medium" role="alert">
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="profile-email"
            className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
          >
            Email Address
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 font-medium" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.1 }}
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-xs font-semibold tracking-wider shadow-lg flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition"
        >
          SAVE SETTINGS
        </motion.button>
      </motion.div>
    </form>
  );
}

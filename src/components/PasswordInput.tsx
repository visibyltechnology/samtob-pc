"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
  minLength,
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minLength?: number;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        required
        type={visible ? "text" : "password"}
        minLength={minLength}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-line rounded-xl pl-4 pr-11 py-3 text-sm focus:outline-none focus:border-signal"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-steel hover:text-signal transition-colors"
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}

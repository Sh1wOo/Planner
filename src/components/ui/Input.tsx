import * as React from "react";
import { clsx } from "clsx";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[13px] font-medium text-inherit/80"
        >
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        className={clsx(
          "block h-12 w-full rounded-xl border bg-transparent px-4 py-3 text-sm leading-normal transition-all",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:ring-4 focus-visible:ring-white/10",
          error
            ? "border-red-400/60 focus-visible:border-red-400"
            : "border-white/12 focus-visible:border-white/30",
          className,
        )}
        {...props}
      />

      {error && <p className="text-[12px] text-red-300">{error}</p>}
    </div>
  );
});

function Button({ onClick, buttonText, Icon, variant = "primary", className = "" }) {
  const styles =
    variant === "primary"
      ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:opacity-85"
      : "border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5";
  return (
    <button
      onClick={() => onClick?.()}
      className={`flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-semibold transition-all ${styles} ${className}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {buttonText}
    </button>
  );
}

export default Button;

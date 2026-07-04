import type { ThemeName } from "../state/playground";

type ThemeToggleProps = {
  theme: ThemeName;
  lightLabel: string;
  darkLabel: string;
  ariaLabel: string;
  onSelect: (theme: ThemeName) => void;
};

export function ThemeToggle({
  theme,
  lightLabel,
  darkLabel,
  ariaLabel,
  onSelect
}: ThemeToggleProps) {
  return (
    <div class="theme-toggle" role="group" aria-label={ariaLabel}>
      <ThemeButton
        label={lightLabel}
        value="light"
        isActive={theme === "light"}
        onSelect={onSelect}
      />
      <ThemeButton
        label={darkLabel}
        value="dark"
        isActive={theme === "dark"}
        onSelect={onSelect}
      />
    </div>
  );
}

type ThemeButtonProps = {
  label: string;
  value: ThemeName;
  isActive: boolean;
  onSelect: (theme: ThemeName) => void;
};

function ThemeButton({ label, value, isActive, onSelect }: ThemeButtonProps) {
  return (
    <button
      type="button"
      class={`theme-toggle__button${isActive ? " theme-toggle__button--active" : ""}`}
      data-theme-choice={value}
      aria-pressed={isActive}
      onClick={() => onSelect(value)}
    >
      {label}
    </button>
  );
}
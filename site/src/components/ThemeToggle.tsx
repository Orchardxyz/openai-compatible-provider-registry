import type { ThemeName } from "../state/playground";

type ThemeToggleProps = {
  theme: ThemeName;
  onSelect: (theme: ThemeName) => void;
};

export function ThemeToggle({ theme, onSelect }: ThemeToggleProps) {
  return (
    <div class="theme-toggle" role="group" aria-label="Theme switcher">
      <ThemeButton
        label="Light"
        value="light"
        isActive={theme === "light"}
        onSelect={onSelect}
      />
      <ThemeButton
        label="Dark"
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
      class="theme-toggle__button"
      data-theme-choice={value}
      aria-pressed={isActive}
      onClick={() => onSelect(value)}
    >
      {label}
    </button>
  );
}

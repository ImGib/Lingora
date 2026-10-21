export interface IpaFormulaBadgeProps {
  rules: string[];
}

export function IpaFormulaBadge({ rules }: IpaFormulaBadgeProps) {
  if (rules.length === 0) return null;

  return (
    <div className="ipa-blend-box" aria-label="Quy tắc đánh vần">
      <div className="ipa-blend-label">🧩 Quy tắc đánh vần</div>
      <div className="ipa-blend-parts">
        {rules.map((rule, index) => (
          <span className="blend-chip" key={`${index}-${rule}`}>{rule}</span>
        ))}
      </div>
    </div>
  );
}

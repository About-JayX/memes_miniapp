import { Selector as Selectors } from "antd-mobile";
export default function Selector({
  options = [],
  value = "",
  onChange,
  className = "",
  loading = false,
}: {
  options?: any[];
  value?: string;
  onChange?: (value: any[], extend: { items: any[] }) => void;
  className?: string;
  loading?: boolean;
}) {
  return (
    <Selectors
      options={options}
      onChange={onChange}
      showCheckMark={false}
      value={[value]}
      defaultValue={[value]}
      disabled={loading}
      style={{
        "--color": "var(--primary-card-body-color)",
        "--padding": "8px 10px",
        "--checked-color": "var(--primary-card-body-color)",
        "--border": "solid transparent 1px",
        "--checked-border": "solid var(--adm-color-primary) 1px",
        "--border-radius": "8px",
        "--checked-text-color": "var(--primary-font-color)",
        "--gap-horizontal": "4px !important",
        "--gap-vertical": "4px !important",
      }}
      className={`!text-xs pb-0 font-bold ${className}`}
    />
  );
}

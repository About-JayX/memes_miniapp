import "./capsuleTabs.scss";

import { CapsuleTabs } from "antd-mobile";
export default function CapsuleTabsC({
  size = "middle",
  activeKey,
  defaultActiveKey,
  onChange,
  children,
  style = {},
}: {
  size?: "small" | "large" | "middle" | "mini" | undefined;
  activeKey?: string | null | undefined;
  defaultActiveKey?: string | null | undefined;
  onChange?: ((key: string) => void) | undefined;
  children?: React.ReactNode;
  style?: any;
}) {
  return (
    <CapsuleTabs
      style={style}
      className={size}
      activeKey={activeKey}
      defaultActiveKey={defaultActiveKey}
      onChange={onChange}
    >
      {children}
    </CapsuleTabs>
  );
}

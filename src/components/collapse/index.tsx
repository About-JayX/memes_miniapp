import { Collapse as Collapses } from "antd-mobile";

import Icon from "../icon";
export default function Collapse({
  children,
  defaultActiveKey = [],
}: {
  children?: React.ReactNode;
  defaultActiveKey?: string[];
}) {
  return (
    <Collapses
      defaultActiveKey={defaultActiveKey}
      arrow={(active) =>
        active ? (
          <Icon name="quotes/up" className="w-[12px] h-[12px] text-white" />
        ) : (
          <Icon name="quotes/down" className="w-[12px] h-[12px] text-white" />
        )
      }
    >
      {children}
    </Collapses>
  );
}

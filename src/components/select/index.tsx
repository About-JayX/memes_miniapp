import { Dropdown, Radio, Space } from "antd-mobile";
import { useEffect, useRef, useState } from "react";

import Icon from "../icon";

export default function Select({
  data = [],
  value = "",
  title = "",
  onChange,
  disabled = false,
}: {
  data?: { value: string; label: string }[];
  value?: string;
  title?: string;
  onChange?: (e: string) => void;
  disabled?: boolean;
}) {
  const dropdownRef: any = useRef(null);
  const dropdown: any = useRef(null);
  const [maxHeight, setMaxHeight] = useState(210);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleResize = () => {
    if (dropdownRef.current) {
      const { top } = dropdownRef.current.getBoundingClientRect();
      const availableHeight = window.innerHeight - top - 20;
      setMaxHeight(availableHeight > 0 ? availableHeight : 210);
    }
  };

  useEffect(() => {
    if (dropdownVisible) {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [dropdownVisible]);

  return (
    <Dropdown
      className={disabled ? "pointer-events-none opacity-50" : ""}
      ref={dropdown}
      // @ts-ignore
      visible={dropdownVisible}
      onVisibleChange={setDropdownVisible}
    >
      <Dropdown.Item
        key="select"
        title={`${data.find((itme) => itme.value === value)?.label}${title}`}
        arrowIcon={<Icon name="up" className="text-white !w-3 !h-3" />}
      >
        <div
          ref={dropdownRef}
          style={{
            padding: 12,
            maxHeight: `${maxHeight}px`,
            overflowY: "auto",
            transition: "max-height 0.3s ease",
          }}
        >
          <Radio.Group
            defaultValue={value}
            onChange={(e: any) => {
              onChange && onChange(e);
              dropdown && dropdown.current.close();
            }}
          >
            <Space direction="vertical" block>
              {data.map((itme, index) => (
                <Radio block value={itme.value} key={index}>
                  {itme.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>
      </Dropdown.Item>
    </Dropdown>
  );
}

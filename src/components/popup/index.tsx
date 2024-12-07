import { Grid, Popup as Popups, type PopupProps } from "antd-mobile";
import { useLayoutEffect, useRef, useState } from "react";

import { Container } from "../box";
import Icon from "../icon";

export default function Popup({
  title = "",
  children,
  footer,
  visible = false,
  showCloseButton = true,
  onClose,
  ...props
}: // iconLocation = 'card-right',
{
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  visible?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
  height?: "auto" | null;
  // iconLocation?: 'top' | 'card-right'
} & PopupProps) {
  const topRef = useRef<HTMLDivElement>(null);
  const [topHeight, setTopHeight] = useState<number>(0);

  const buttonRef = useRef<HTMLDivElement>(null);
  const [buttonHeight, setButtonHeight] = useState<number>(0);

  useLayoutEffect(() => {
    if (topRef.current) {
      const height = topRef.current.getBoundingClientRect().height;
      setTopHeight(height);
    }

    if (buttonRef.current) {
      const height = buttonRef.current.getBoundingClientRect().height;
      setButtonHeight(height);
    }
  }, []);
  return (
    <Popups visible={visible} onClose={onClose} closeOnMaskClick {...props}>
      <Container className="bg-[--primary-bg-color] rounded-ss-[--radius] rounded-se-[--radius] popups_container">
        <Grid columns={1} gap={20}>
          <Grid.Item className="flex">
            <div className="flex-1" />
            {showCloseButton ? (
              <a onClick={() => onClose && onClose()} className="text-white">
                <Icon name="close" />
              </a>
            ):<div className="w-5 h-5"/>}
          </Grid.Item>

          {title && (
            <div ref={topRef}>
              <Grid.Item className="text-lg text-center">{title}</Grid.Item>
            </div>
          )}
          {children && (
            <div
              className={`h-full max-h-[calc(100vh-${
                topHeight + buttonHeight + 40 * 4 + 16 * 2
              }px)] overflow-y-auto customize—popup`}
            >
              {children}
            </div>
          )}
          {footer && <div ref={buttonRef}>{footer}</div>}
          <div className="pb-8" />
        </Grid>
      </Container>
    </Popups>
  );
}

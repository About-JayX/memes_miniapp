import { FloatingPanel } from "antd-mobile";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const Content = ({
  children,
  bodyHeight = 0,
  headerHeight = 0,
  onViewStatus,
  viewStatus = false,
  overflowY = false,
  onBodyHeight,
}: {
  children?: React.ReactNode;
  bodyHeight?: number;
  headerHeight?: number;
  viewStatus?: boolean;
  onViewStatus?: (e: boolean) => void;
  overflowY?: boolean;
  onBodyHeight?: (e: number) => void;
}) => {
  const [topHeight, setTopHeight] = useState<number>(0);
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
  const [animating, setAnimating] = useState<boolean>(false);
  const [animation, setAnimation] = useState(false);
  const [status, setStatus] = useState(true);

  useEffect(() => {
    const checkPageLoaded = () => {
      if (document.readyState === "complete") {
        const topElement = document.getElementById("top");
        if (topElement) {
          const topElementHeight = topElement.getBoundingClientRect().height;
          setTopHeight(topElementHeight);
        }
        setIsPageLoaded(true);
      }
    };

    checkPageLoaded();
    window.addEventListener("load", checkPageLoaded);

    return () => {
      window.removeEventListener("load", checkPageLoaded);
    };
  }, []);

  useEffect(() => {
    if (!isPageLoaded) return;

    // 如果 bodyHeight 是 0，启动动画效果
    if (bodyHeight === 0) {
      setAnimating(true);
    }
    setTimeout(() => setAnimation(true), 100);
  }, [isPageLoaded, bodyHeight]);

  useEffect(() => {
    if (!isPageLoaded) {
      setTimeout(() => setStatus(false), 300);
    }
  }, [isPageLoaded]);

  const [view, setView] = useState(false);
  useEffect(() => {
    onViewStatus && onViewStatus(view);
  }, [view]);

  // 缓存窗口高度，避免重复计算
  const windowHeight = window.innerHeight;

  // 动态计算浮动面板的锚点
  const anchors = [
    windowHeight -
      (headerHeight +
        bodyHeight +
        topHeight +
        16 * 2 +
        8 * 2 +
        16 * (bodyHeight ? 2 : 1)),
    windowHeight - (headerHeight + topHeight + 16 * 2 + 8 * 2 + 16),
  ];

  useLayoutEffect(() => {
    onBodyHeight && onBodyHeight(animating ? anchors[1] : anchors[0]);
  }, [isPageLoaded]);
  if (!isPageLoaded) return null;
  return (
    <FloatingPanel
      onHeightChange={(height: number) => {
        setAnimating(height >= anchors[1]);
        setView(!viewStatus);
        onBodyHeight && onBodyHeight(height);
      }}
      style={{
        transform: `translateY(calc(100% + ${animation ? -anchors[1] : 0}px))`,
        "--header-height": "36px",
      }}
      handleDraggingOfContent={false}
      className={`!z-1 mb-[3rem] ${
        status ? "transition-all duration-300" : ""
      }`}
      anchors={anchors}
    >
      <div
        className={`h-[calc(100vh-${
          animating
            ? Number(
                headerHeight + topHeight + 16 * 4 + 8 * 4 + 28 + 0
              ).toFixed(0)
            : Number(
                headerHeight +
                  bodyHeight +
                  topHeight +
                  16 * 4 +
                  8 * 2 +
                  16 * (bodyHeight ? 2 : 1) +
                  36
              ).toFixed(0)
        }px)] scroll-container ${overflowY ? "overflow-y-auto" : ""}`}
      >
        {children}
      </div>
    </FloatingPanel>
  );
};

export const Container = ({
  children,
  className = "",
  style = {},
}: {
  children?: React.ReactNode;
  className?: string;
  style?: any;
}) => {
  return (
    <div className={`w-full p-4 ${className}`} style={style}>
      {children}
    </div>
  );
};

export default function Box({
  children,
  body,
  header,
  viewStatus = false,
  onViewStatus,
  onBodyHeight,
}: {
  children?: React.ReactNode;
  body?: React.ReactNode;
  header?: React.ReactNode;
  viewStatus?: boolean;
  onViewStatus?: (e: boolean) => void;
  onBodyHeight?: (e: number) => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [bodyHeight, setBodyHeight] = useState<number>(0);

  useLayoutEffect(() => {
    if (bodyRef.current) {
      const height = bodyRef.current.getBoundingClientRect().height;
      setBodyHeight(height);
    }
  }, [body]);

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  useLayoutEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.getBoundingClientRect().height;
      setHeaderHeight(height);
    }
  }, [header]);

  return (
    <div className="h-full flex flex-col bg-[--primary-bg-color] gap-4">
      <div className="flex-[0]" ref={headerRef}>
        {header}
      </div>
      {body && (
        <div className="flex-[0]" ref={bodyRef}>
          <Container className="py-0">{body}</Container>
        </div>
      )}
      <Content
        viewStatus={viewStatus}
        bodyHeight={bodyHeight}
        headerHeight={headerHeight}
        onViewStatus={onViewStatus}
        onBodyHeight={(e) => onBodyHeight && onBodyHeight(e)}
      >
        {children}
      </Content>
    </div>
  );
}

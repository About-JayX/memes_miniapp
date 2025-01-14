import { useRequest } from "ahooks";
import { DotLoading, Popup } from "antd-mobile";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import Icon from "../icon";
import Input from "../input";

export default function Search({
  content,
  onChange,
  value = "",
  placeholder = "",
  viewStatus = false,
  onBodyHeight,
  onStatus,
  onSearchLoadStatus,
}: {
  content?: React.ReactNode;
  onChange?: (e: string) => Promise<any>;
  value?: string;
  placeholder?: string;
  viewStatus?: boolean;
  onBodyHeight?: (e: number) => void;
  onStatus?: (e: boolean) => void;
  onSearchLoadStatus?: (e: boolean) => void;
}) {
  const inputRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupTop, setPopupTop] = useState(0);
  const [input, setInput] = useState<string>(value || "");
  const [status, setStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updatePopupTop = useCallback(() => {
    if (inputRef.current) {
      const top = inputRef.current.getBoundingClientRect().top + window.scrollY;
      setPopupTop(top);
      onBodyHeight && onBodyHeight(top);
    }
  }, []);

  useEffect(() => {
    updatePopupTop();
  }, [input, viewStatus]);

  const { run } = useRequest(
    async (searchValue: string) => {
      if (!searchValue.trim()) return;
      setIsLoading(true);
      onSearchLoadStatus && onSearchLoadStatus(true);
      try {
        await onChange?.(searchValue);
      } finally {
        // 移除搜索完成时的状态重置
        // setIsLoading(false);
      }
    },
    {
      debounceWait: 500,
      manual: true,
    }
  );

  useEffect(() => {
    const hasInput = Boolean(input.trim());
    setStatus(hasInput);
    onStatus && onStatus(hasInput);
    if (!hasInput) {
      onSearchLoadStatus && onSearchLoadStatus(false);
    }
  }, [input]);

  return (
    <Fragment>
      <div ref={inputRef} className="mt-[-1px]">
        <Input
          placeholder={placeholder}
          value={input}
          prefix={<Icon name="search" />}
          onChange={(search: string) => {
            setInput(search);
            if (search.trim()) {
              run(search);
            }
          }}
          className="z-50"
          suffix={
            input && (
              <a
                className="text-white"
                onClick={() => {
                  setInput("");
                  onStatus && onStatus(false);
                  onSearchLoadStatus && onSearchLoadStatus(false);
                }}
              >
                <Icon name="close" />
              </a>
            )
          }
        />
        <div
          ref={popupRef}
          className={`w-full h-full rounded-xl overflow-hidden pointer-events-auto absolute top-[54px] left-4`}
          style={{
            height: `calc(100vh - ${popupTop + 72 * 1}px)`,
            width: `calc(100% - 32px)`,
          }}
        >
          {content}
        </div>
      </div>
    </Fragment>
  );
}

import { useRequest } from "ahooks";
import { DotLoading, Popup } from "antd-mobile";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const inputRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupTop, setPopupTop] = useState(0);
  const [input, setInput] = useState<string>(value || "");
  const [status, setStatus] = useState<boolean>(false);
  const [isInputting, setIsInputting] = useState(false);
  const { run } = useRequest(
    async (searchValue: string) => {
      console.log('[search][Search] useRequest run:', searchValue)
      if (!searchValue.trim()) {
        onSearchLoadStatus && onSearchLoadStatus(false);
        setIsInputting(false);
        return;
      }
      
      try {
        console.log('[search][Search] before onChange call')
        await onChange?.(searchValue);
        console.log('[search][Search] after onChange call')
      } finally {
        onSearchLoadStatus && onSearchLoadStatus(false);
        setIsInputting(false);
      }
    },
    {
      debounceWait: 1000,
      throttleWait: 2000,
      manual: true,
    }
  );

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

  useEffect(() => {
    console.log('[search][Search] useEffect input:', input)
    const hasInput = Boolean(input.trim());
    setStatus(hasInput);
    onStatus && onStatus(hasInput);
    setIsInputting(hasInput);
    
    if (hasInput) {
      run(input);
    } 
  }, [input]);

  return (
    <Fragment>
      <div ref={inputRef} className="mt-[-1px]">
        <Input
          placeholder={t(placeholder)}
          value={input}
          prefix={<Icon name="search" />}
          onChange={(search: string) => {
            console.log('[search][Search] Input onChange:', search)
            setInput(search);
            // 立即设置加载状态
            if (search.trim()) {
              onSearchLoadStatus && onSearchLoadStatus(true);
              setIsInputting(true);
            } else {
              onSearchLoadStatus && onSearchLoadStatus(false);
              setIsInputting(false);
            }
          }}
          className="z-50"
          suffix={
            <div className="flex items-center">
              {isInputting && <DotLoading color="primary" />}
              {input && (
                <a
                  className="text-white ml-2"
                  onClick={() => {
                    setInput("");
                    onStatus && onStatus(false);
                    onSearchLoadStatus && onSearchLoadStatus(false);
                    setIsInputting(false);
                  }}
                >
                  <Icon name="close" />
                </a>
              )}
            </div>
          }
        />
        {status && (
          <div
            ref={popupRef}
            className="w-full h-full rounded-xl overflow-hidden pointer-events-auto absolute top-[54px] left-0 px-4"
            style={{
              height: `calc(100vh - 110px)`,
              width: `100%`,
            }}
          >
            {content}
          </div>
        )}
      </div>
    </Fragment>
  );
}

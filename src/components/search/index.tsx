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
  const popupRef = useRef<HTMLDivElement>(null); // Ref for detecting outside clicks
  const [popupTop, setPopupTop] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>(value || "");
  const [status, setStatus] = useState<boolean>(input !== "" || false);

  // Update popup position based on inputRef position
  const updatePopupTop = useCallback(() => {
    if (inputRef.current) {
      setPopupTop(
        inputRef.current.getBoundingClientRect().top + window.scrollY
      );

      onBodyHeight &&
        onBodyHeight(
          inputRef.current.getBoundingClientRect().top + window.scrollY
        );
    }
  }, []);

  useEffect(() => {
    updatePopupTop(); // Initial calculation for popupTop position
  }, [input, viewStatus]);

  const { run } = useRequest(
    async (searchValue: string) => {
      onChange && (await onChange(searchValue));
    },
    {
      debounceWait: 1500,
      manual: true,
      onSuccess: () => {
        setLoading(false);
        onSearchLoadStatus && onSearchLoadStatus(false)
      }, // Stop loading on success
    }
  );

  useEffect(() => {
    input ? setStatus(true) : setStatus(false);
    onStatus && onStatus(input ? true : false);
  }, [input]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        // setStatus(false); // Close the popup
        // onStatus && onStatus(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Fragment>
      <div ref={inputRef} className="mt-[-1px]">
        <Input
          placeholder={placeholder}
          value={input}
          prefix={<Icon name="search" />}
          onChange={(search: string) => {
            onStatus && onStatus(true);
            setStatus(true);
            setLoading(true);
            onSearchLoadStatus && onSearchLoadStatus(true);
            setInput(search);
            run(search);
            if (!search) {
              setStatus(false);
              onStatus && onStatus(false);
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
                }}
              >
                <Icon name="close" />
              </a>
            )
          }
          onClick={() => {
            if (status) return;
            setStatus(input !== "");
          }}
        />
        {status && (
          <Fragment>
            <div className="w-[calc(100%-30px)] h-screen absolute  left-[15px] top-[54px] rounded-lg" />
            <div
              ref={popupRef} // Set ref for the popup
              className={`w-full h-full rounded-xl  overflow-hidden pointer-events-auto absolute top-[54px] left-4 ${
                loading ? "flex justify-center" : ""
              }`}
              style={{
                height: `calc(100vh - ${popupTop + 72 * 1}px)`,
                width: `calc(100% - 32px)`,
              }}
            >
              {loading ? <DotLoading className="text-2xl" /> : content}
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

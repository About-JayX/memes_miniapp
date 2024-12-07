import "./index.scss";
export default function Button({
  animation = true,
  className="",
  ...props
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  animation?: boolean;
}) {
  return (
    <a
      id="memes-button-icon"
      className={`relative text-current font-bold ${className}`}
      {...props}
    >
      {animation && <div className="filterBorder" />}

      <div className="filterBg" />
      {props.children}
    </a>
  );
}

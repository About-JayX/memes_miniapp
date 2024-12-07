import React from "react";

const Icon = React.memo(function Icon({
  name,
  className = "",
  style = {},
}: {
  name: string;
  className?: string;
  style?: any;
}) {
  return (
    <svg className={`w-5 h-5 ${className}`} aria-hidden="true" style={style}>
      <use xlinkHref={`#icon-${name}`} />
    </svg>
  );
});

export default Icon;

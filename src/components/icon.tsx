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
  const env = import.meta.env.MODE.split('-')[1]
  
  return (
    <svg className={`w-5 h-5 ${className}`} aria-hidden="true" style={style}>
      <use xlinkHref={`#icon-${env}/${name}`} />
    </svg>
  );
});

export default Icon;

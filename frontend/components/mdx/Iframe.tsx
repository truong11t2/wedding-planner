import React from 'react';

type IframeProps = React.IframeHTMLAttributes<HTMLIFrameElement> & {
  height?: number | string;
};

export default function Iframe({ src = '', height = 480, className, style, ...props }: IframeProps) {
  const mergedStyle = { border: 0, ...(style as React.CSSProperties) };

  return (
    <iframe
      src={src}
      className={className}
      height={typeof height === 'number' ? String(height) : height}
      style={mergedStyle}
      loading="lazy"
      sandbox="allow-scripts allow-same-origin"
      referrerPolicy="no-referrer"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      {...props}
    />
  );
}

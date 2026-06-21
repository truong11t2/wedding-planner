"use client"

import React from "react";

type AccordionItemProps = {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
};

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const css = `
    .accordion-item summary .chev { transition: transform .18s ease-in-out; }
    .accordion-item[open] summary .chev { transform: rotate(90deg); }
  `;

  return (
    <details open={defaultOpen} className="accordion-item mb-3 border rounded-md overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <summary className="cursor-pointer px-4 py-2 bg-gray-100 flex items-center justify-between text-sm">
        <span>{title}</span>
        <svg
          className="chev ml-3"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" fill="currentColor" />
        </svg>
      </summary>

      <div className="p-4 bg-white prose max-w-none">
        {children}
      </div>
    </details>
  );
}

type AccordionProps = {
  children: React.ReactNode;
};

export default function Accordion({ children }: AccordionProps) {
  return <div>{children}</div>;
}

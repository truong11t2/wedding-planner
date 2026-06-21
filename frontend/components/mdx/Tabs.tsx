import React, { Children, isValidElement } from "react";

type TabProps = {
  title: string;
  children?: React.ReactNode;
};

function Tab({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

type TabsProps = {
  defaultIndex?: number;
  id?: string;
  children: React.ReactNode;
};

let instanceCounter = 0;

export default function Tabs({ defaultIndex = 0, id, children }: TabsProps) {
  const tabs = Children.toArray(children).filter(isValidElement).map((child: any) => ({
    title: child.props.title,
    content: child.props.children,
  }));

  if (!tabs.length) return null;

  const instanceId = id || `tabs-${++instanceCounter}`;
  // Build per-instance CSS to show the correct panel when its radio is checked
  // and to style the active label. Panels are rendered below the labels,
  // so we use `:checked + label` for the label and `:checked ~ #panel` for the panel.
  const cssRules = tabs
    .map((_, i) => {
      const inputId = `${instanceId}-input-${i}`;
      const panelId = `${instanceId}-panel-${i}`;
      return [
        // style the label when its input is checked
        `#${inputId}:checked + label[for="${inputId}"] { background-color: #db2777; color: #ffffff; }`,
        // show the panel when its input is checked — panels live inside the .panels wrapper
        `#${inputId}:checked ~ .${instanceId}-panels #${panelId} { display: block; }`,
      ].join("\n");
    })
    .join("\n") + `\n.${instanceId}-panels img { max-width: 100%; height: auto; display: block; }`;

  return (
    <div className="w-full my-6">
      <style dangerouslySetInnerHTML={{ __html: cssRules }} />
      {/* Render inputs + labels first so panels can appear below */}
      {tabs.map((t, i) => {
        const inputId = `${instanceId}-input-${i}`;
        const panelId = `${instanceId}-panel-${i}`;
        const tabId = `${instanceId}-tab-${i}`;
        return (
          <React.Fragment key={i}>
            <input
              type="radio"
              name={instanceId}
              id={inputId}
              defaultChecked={i === defaultIndex}
              className="hidden"
            />

            <label
              htmlFor={inputId}
              id={tabId}
              role="tab"
              aria-controls={panelId}
              className={`px-3 py-1 rounded-md text-sm cursor-pointer inline-flex items-center mr-2 mb-2 bg-gray-100 text-gray-800 hover:bg-gray-200`}
            >
              {t.title}
            </label>
          </React.Fragment>
        );
      })}

      <div className={`mt-4 ${instanceId}-panels`} role="tablist" aria-label="Tabs">
        {tabs.map((t, i) => {
          const panelId = `${instanceId}-panel-${i}`;
          const tabId = `${instanceId}-tab-${i}`;
          return (
            <div
              key={i}
              id={panelId}
              role="tabpanel"
              aria-labelledby={tabId}
              className="prose max-w-none hidden mt-0 rounded-md bg-white shadow-sm"
            >
              {t.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// attach Tab as subcomponent for MDX usage: <Tabs><Tabs.Tab title="...">...</Tabs.Tab></Tabs>
(Tabs as any).Tab = Tab;
export { Tab };

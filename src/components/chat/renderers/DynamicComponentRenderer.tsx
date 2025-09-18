// @/components/chat/DynamicComponentRenderer.tsx

import React from "react";
import { componentRegistry } from "@/components/componentRegistry";
import { DynamicComponentBlueprint } from "@/components/chat/types";

const DynamicComponentRenderer = ({ data }: { data: DynamicComponentBlueprint }) => {
  const { component, props } = data;

  // Look up the component in our safe registry
  const ComponentToRender = componentRegistry[component];

  // If the component exists, render it with the provided props
  if (ComponentToRender) {
    return <ComponentToRender {...props} />;
  }

  // Otherwise, render a fallback/error message for safety
  return (
    <div className="border-l-4 border-red-500 bg-red-50 p-4 my-2 text-red-700">
      <p className="font-bold">Error: Unknown Component</p>
      <p>The AI requested a component named "{component}" which is not registered.</p>
    </div>
  );
};

export default DynamicComponentRenderer;
import { Registry } from "@/registry/schema";

export const examples: Registry = [
  {
    name: "accordion-demo",
    type: "registry:example",
    registryDependencies: ["accordion"],
    files: ["example/accordion-demo.tsx"],
  },
];

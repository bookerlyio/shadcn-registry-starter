import { Registry } from "@/registry/schema";

export const blocks: Registry = [
  {
    name: "login-01",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label"],
    files: [
      {
        path: "block/login-01/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "block/login-01/components/login-form.tsx",
        type: "registry:component",
      },
    ],
    category: "Authentication",
    subcategory: "Login",
  },
  {
    name: "authentication-01",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label"],
    files: ["block/authentication-01.tsx"],
    category: "Authentication",
    subcategory: "Login",
  },
];

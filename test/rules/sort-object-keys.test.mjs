import { describe, it } from "node:test";

import { RuleTester } from "eslint";

import rule from "../../src/rules/sort-object-keys.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({ languageOptions: { ecmaVersion: "latest", sourceType: "module" } });

tester.run("sort-object-keys", rule, {
  invalid: [
    {
      code: "const x = { b, a };",
      errors: [{ messageId: "unsorted" }],
      output: "const x = { a, b };"
    },
    {
      code: "const x = { foo: 1, a };",
      errors: [{ messageId: "unsorted" }],
      output: "const x = { a, foo: 1 };"
    },
    {
      code: "const x = { b: 1, a: 1 };",
      errors: [{ messageId: "unsorted" }],
      output: "const x = { a: 1, b: 1 };"
    },
    {
      code: "const x = { b, a, bar: 1, foo: 2 };",
      errors: [{ messageId: "unsorted" }],
      output: "const x = { a, b, bar: 1, foo: 2 };"
    }
  ],
  valid: [
    { code: "const x = { a, b, c };" },
    { code: "const x = { a, b, bar: 1, foo: 2 };" },
    { code: "const x = { ...y };" },
    { code: "const x = { [k]: 1 };" },
    { code: "const x = {};" },
    { code: "const x = { a: 1 };" }
  ]
});

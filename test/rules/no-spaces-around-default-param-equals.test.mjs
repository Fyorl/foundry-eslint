import { describe, it } from "node:test";

import { RuleTester } from "eslint";

import rule from "../../src/rules/no-spaces-around-default-param-equals.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({ languageOptions: { ecmaVersion: "latest", sourceType: "module" } });

tester.run("no-spaces-around-default-param-equals", rule, {
  invalid: [
    {
      code: "function foo(x = 1) {}",
      errors: [{ messageId: "spacedEquals" }],
      output: "function foo(x=1) {}"
    },
    {
      code: "function foo(x =1) {}",
      errors: [{ messageId: "spacedEquals" }],
      output: "function foo(x=1) {}"
    },
    {
      code: "function foo(x= 1) {}",
      errors: [{ messageId: "spacedEquals" }],
      output: "function foo(x=1) {}"
    },
    {
      code: "const f = (x = 1) => x;",
      errors: [{ messageId: "spacedEquals" }],
      output: "const f = (x=1) => x;"
    }
  ],
  valid: [
    { code: "function foo(x=1) {}" },
    { code: "const f = (x=1) => x;" },
    { code: "const f = function(x=1) {};" },
    { code: "const { x = 1 } = obj;" }
  ]
});

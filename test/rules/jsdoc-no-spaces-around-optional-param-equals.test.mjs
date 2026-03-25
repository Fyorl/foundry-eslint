import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { RuleTester } from "eslint";

import rule from "../../src/rules/jsdoc-no-spaces-around-optional-param-equals.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const dir = join(dirname(fileURLToPath(import.meta.url)), "../fixtures/jsdoc-no-spaces-around-optional-param-equals");
const load = name => readFileSync(join(dir, name), "utf8");

const tester = new RuleTester({ languageOptions: { ecmaVersion: "latest", sourceType: "module" } });

tester.run("jsdoc-no-spaces-around-optional-param-equals", rule, {
  invalid: [
    {
      code: load("invalid/both-sides.js"),
      errors: [{ messageId: "spacedEquals" }],
      output: load("output/both-sides.js")
    },
    {
      code: load("invalid/left-side.js"),
      errors: [{ messageId: "spacedEquals" }],
      output: load("output/left-side.js")
    },
    {
      code: load("invalid/right-side.js"),
      errors: [{ messageId: "spacedEquals" }],
      output: load("output/right-side.js")
    },
    {
      code: load("invalid/multiple-params.js"),
      errors: [{ messageId: "spacedEquals" }, { messageId: "spacedEquals" }],
      output: load("output/multiple-params.js")
    }
  ],
  valid: [
    { code: load("valid/no-spaces.js") },
    { code: load("valid/no-default.js") },
    { code: '/* [foo = "bar"] - not a JSDoc comment. */' }
  ]
});

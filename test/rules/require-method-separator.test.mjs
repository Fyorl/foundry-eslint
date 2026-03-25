import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { RuleTester } from "eslint";

import rule from "../../src/rules/require-method-separator.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const dir = join(dirname(fileURLToPath(import.meta.url)), "../fixtures/require-method-separator");
const load = name => readFileSync(join(dir, name), "utf8");

const tester = new RuleTester({ languageOptions: { ecmaVersion: "latest", sourceType: "module" } });

tester.run("require-method-separator", rule, {
  invalid: [
    {
      code: load("invalid/two-methods-no-separator.js"),
      errors: [{ data: { kind: "method" }, messageId: "missingSeparator" }],
      output: load("output/two-methods-no-separator.js")
    },
    {
      code: load("invalid/three-methods-third-missing.js"),
      errors: [{ data: { kind: "method" }, messageId: "missingSeparator" }],
      output: load("output/three-methods-third-missing.js")
    },
    {
      code: load("invalid/two-functions-no-separator.js"),
      errors: [{ data: { kind: "function" }, messageId: "missingSeparator" }],
      output: load("output/two-functions-no-separator.js")
    },
    {
      code: load("invalid/two-exports-no-separator.js"),
      errors: [{ data: { kind: "function" }, messageId: "missingSeparator" }],
      output: load("output/two-exports-no-separator.js")
    },
    {
      code: load("invalid/mixed-functions-no-separator.js"),
      errors: [{ data: { kind: "function" }, messageId: "missingSeparator" }],
      output: load("output/mixed-functions-no-separator.js")
    }
  ],
  valid: [
    { code: load("valid/single-method.js") },
    { code: load("valid/two-methods-separated.js") },
    { code: load("valid/three-methods-separated.js") },
    { code: load("valid/single-function.js") },
    { code: load("valid/two-functions-separated.js") },
    { code: load("valid/two-exports-separated.js") },
    { code: load("valid/export-after-var.js") }
  ]
});

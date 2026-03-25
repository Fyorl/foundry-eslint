import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { RuleTester } from "eslint";

import rule from "../../src/rules/require-arrow-braces.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const dir = join(dirname(fileURLToPath(import.meta.url)), "../fixtures/require-arrow-braces");
const load = name => readFileSync(join(dir, name), "utf8");

const tester = new RuleTester({ languageOptions: { ecmaVersion: "latest", sourceType: "module" } });

tester.run("require-arrow-braces", rule, {
  invalid: [
    {
      code: load("invalid/multi-line-no-braces.js"),
      errors: [{ messageId: "requireBraces" }],
      output: load("output/multi-line-no-braces.js")
    }
  ],
  valid: [
    { code: "const f = x => x + 1;" },
    { code: load("valid/block-body.js") },
    { code: "const f = x => ({ a: 1 });" }
  ]
});

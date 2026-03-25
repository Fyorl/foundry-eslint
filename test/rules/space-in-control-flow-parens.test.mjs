import { describe, it } from "node:test";

import { RuleTester } from "eslint";

import rule from "../../src/rules/space-in-control-flow-parens.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({ languageOptions: { ecmaVersion: "latest", sourceType: "module" } });

tester.run("space-in-control-flow-parens", rule, {
  invalid: [
    {
      code: "if (x) {}",
      errors: [{ messageId: "missingOpenSpace" }, { messageId: "missingCloseSpace" }],
      output: "if ( x ) {}"
    },
    {
      code: "if (x ) {}",
      errors: [{ messageId: "missingOpenSpace" }],
      output: "if ( x ) {}"
    },
    {
      code: "if ( x) {}",
      errors: [{ messageId: "missingCloseSpace" }],
      output: "if ( x ) {}"
    },
    {
      code: "while (x) {}",
      errors: [{ messageId: "missingOpenSpace" }, { messageId: "missingCloseSpace" }],
      output: "while ( x ) {}"
    },
    {
      code: "for (let i = 0; i < 10; i++) {}",
      errors: [{ messageId: "missingOpenSpace" }, { messageId: "missingCloseSpace" }],
      output: "for ( let i = 0; i < 10; i++ ) {}"
    },
    {
      code: "for (const x of arr) {}",
      errors: [{ messageId: "missingOpenSpace" }, { messageId: "missingCloseSpace" }],
      output: "for ( const x of arr ) {}"
    },
    {
      code: "for (const x in obj) {}",
      errors: [{ messageId: "missingOpenSpace" }, { messageId: "missingCloseSpace" }],
      output: "for ( const x in obj ) {}"
    },
    {
      code: "switch (x) {}",
      errors: [{ messageId: "missingOpenSpace" }, { messageId: "missingCloseSpace" }],
      output: "switch ( x ) {}"
    },
    {
      code: "do {} while (x);",
      errors: [{ messageId: "missingOpenSpace" }, { messageId: "missingCloseSpace" }],
      output: "do {} while ( x );"
    },
    {
      code: "try {} catch (e) {}",
      errors: [{ messageId: "missingOpenSpace" }, { messageId: "missingCloseSpace" }],
      output: "try {} catch ( e ) {}"
    }
  ],
  valid: [
    { code: "if ( x ) {}" },
    { code: "if ( x ) {} else if ( y ) {}" },
    { code: "for ( let i = 0; i < 10; i++ ) {}" },
    { code: "for ( const x of arr ) {}" },
    { code: "for ( const x in obj ) {}" },
    { code: "while ( x ) {}" },
    { code: "do {} while ( x );" },
    { code: "switch ( x ) {}" },
    { code: "try {} catch ( e ) {}" },
    { code: "try {} catch {}" }
  ]
});

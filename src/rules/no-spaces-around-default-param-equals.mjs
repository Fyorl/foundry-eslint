/**
 * @import { Rule } from 'eslint'
 */

import { BaseRule } from "./base.mjs";

const FUNCTION_TYPES = new Set([
  "ArrowFunctionExpression",
  "FunctionDeclaration",
  "FunctionExpression"
]);

/**
 * Enforce no spaces around the = sign in function default parameters.
 * E.g. `function foo(x=1)` not `function foo(x = 1)`.
 */
class NoSpacesAroundDefaultParamEquals extends BaseRule {

  /**
   * @type {Rule.RuleMetaData}
   */
  static meta = {
    fixable: "whitespace",
    messages: {
      spacedEquals: "Unexpected spaces around = in default parameter."
    },
    schema: [],
    type: "layout"
  };

  /* -------------------------------------------- */

  /** @override */
  _listeners() {
    return {
      AssignmentPattern: this.#onAssignmentPattern.bind(this)
    };
  }

  /* -------------------------------------------- */

  /**
   * Handle an AssignmentPattern node.
   * @param {object} node
   */
  #onAssignmentPattern(node) {
    if ( !FUNCTION_TYPES.has(node.parent.type) ) return;
    const equalsToken = this.src.getTokenAfter(node.left);
    const tokenBeforeEquals = this.src.getTokenBefore(equalsToken);
    const tokenAfterEquals = this.src.getTokenAfter(equalsToken);
    const hasSpaceBefore = equalsToken.range[0] > tokenBeforeEquals.range[1];
    const hasSpaceAfter = tokenAfterEquals.range[0] > equalsToken.range[1];
    if ( !hasSpaceBefore && !hasSpaceAfter ) return;
    this.context.report({
      node,
      fix: fixer => {
        const fixes = [];
        if ( hasSpaceBefore ) fixes.push(fixer.removeRange([tokenBeforeEquals.range[1], equalsToken.range[0]]));
        if ( hasSpaceAfter ) fixes.push(fixer.removeRange([equalsToken.range[1], tokenAfterEquals.range[0]]));
        return fixes;
      },
      messageId: "spacedEquals"
    });
  }

}

/* -------------------------------------------- */

export default NoSpacesAroundDefaultParamEquals.rule();

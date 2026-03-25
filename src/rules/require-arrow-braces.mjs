/**
 * @import { Rule } from 'eslint'
 */

import { BaseRule } from "./base.mjs";

/**
 * Require block bodies (braces + explicit return) for multi-line arrow functions.
 * Single-line concise bodies are allowed.
 */
class RequireArrowBraces extends BaseRule {

  /**
   * @type {Rule.RuleMetaData}
   */
  static meta = {
    fixable: "code",
    messages: {
      requireBraces: "Multi-line arrow function body must use braces and an explicit return."
    },
    schema: [],
    type: "layout"
  };

  /* -------------------------------------------- */

  /** @override */
  _listeners() {
    return {
      ArrowFunctionExpression: this.#onArrow.bind(this)
    };
  }

  /* -------------------------------------------- */

  /**
   * Handle an arrow function expression.
   * @param {object} node
   */
  #onArrow(node) {
    if ( node.body.type === "BlockStatement" ) return;
    const arrowToken = this.src.getTokenBefore(node.body);
    if ( node.body.loc.start.line === arrowToken.loc.end.line ) return;
    this.context.report({
      node,
      fix: fixer => {
        const bodyText = this.src.getText(node.body);
        const bodyIndent = " ".repeat(node.body.loc.start.column);
        const closeIndent = this.src.lines[arrowToken.loc.start.line - 1].match(/^\s*/)[0];
        return fixer.replaceTextRange(
          [arrowToken.range[1], node.body.range[1]],
          ` {\n${bodyIndent}return ${bodyText};\n${closeIndent}}`
        );
      },
      messageId: "requireBraces"
    });
  }

}

/* -------------------------------------------- */

export default RequireArrowBraces.rule();

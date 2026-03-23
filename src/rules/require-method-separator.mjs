/**
 * @import { Rule } from 'eslint'
 */

import { BaseRule } from "./base.mjs";

/**
 * Matches separator block comment values (3+ dashes).
 */
const SEPARATOR_RE = /^ -{3,} $/;

/**
 * Enforce a separator comment before each top-level function declaration (after the first), and before each class
 * method (after the first).
 */
class RequireMethodSeparator extends BaseRule {

  /**
   * @type {Rule.RuleMetaData}
   */
  static meta = {
    fixable: "code",
    messages: {
      missingSeparator: "Expected a /* --- */ separator comment before this {{kind}}."
    },
    schema: [],
    type: "layout"
  };

  /* -------------------------------------------- */

  /**
   * Build the AST visitor listener map.
   * @returns {Rule.RuleListener}
   * @protected
   */
  _listeners() {
    return {
      "ClassBody > MethodDefinition": this.#onClassMethod.bind(this),
      "Program > FunctionDeclaration": this.#onTopLevelFunction.bind(this)
    };
  }

  /* -------------------------------------------- */

  /**
   * Check that a separator comment precedes the node, and report if not.
   * Only enforced when a prior sibling of the same node type exists, i.e. the separator is between items, not before
   * the first item.
   * @param {object} node  An AST node whose parent has a body array.
   * @param {string} kind  Label used in the diagnostic message.
   */
  #check(node, kind) {
    const siblings = node.parent.body;
    const index = siblings.indexOf(node);
    const hasPrior = siblings.slice(0, index).some(s => s.type === node.type);
    if ( !hasPrior ) return;
    if ( !this.#hasSeparatorBefore(node) ) {
      this.context.report({
        node,
        data: { kind },
        fix: fixer => {
          const comments = this.src.getCommentsBefore(node);
          const target = comments.length ? comments[0] : node;
          const indent = " ".repeat(target.loc.start.column);
          return fixer.insertTextBefore(target, `/* -------------------------------------------- */\n\n${indent}`);
        },
        messageId: "missingSeparator"
      });
    }
  }

  /* -------------------------------------------- */

  /**
   * Whether a separator block comment appears before this node.
   * @param {object} node
   * @returns {boolean}
   */
  #hasSeparatorBefore(node) {
    return this.src.getCommentsBefore(node).some(c => (c.type === "Block") && SEPARATOR_RE.test(c.value));
  }

  /* -------------------------------------------- */

  /**
   * Handle class method definition.
   * @param {object} node
   */
  #onClassMethod(node) {
    this.#check(node, "method");
  }

  /* -------------------------------------------- */

  /**
   * Handle top-level function declaration.
   * @param {object} node
   */
  #onTopLevelFunction(node) {
    this.#check(node, "function");
  }

}

/* -------------------------------------------- */

export default RequireMethodSeparator.rule();

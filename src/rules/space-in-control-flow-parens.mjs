/**
 * @import { AST, Rule } from 'eslint'
 */

import { BaseRule } from "./base.mjs";

/**
 * Return true if the token is a close-parenthesis.
 * @param {AST.Token|null} [token]
 * @returns {boolean}
 */
function isCloseParen(token) {
  return token?.value === ")";
}

/* -------------------------------------------- */

/**
 * Return true if the token is an open-parenthesis.
 * @param {AST.Token|null} [token]
 * @returns {boolean}
 */
function isOpenParen(token) {
  return token?.value === "(";
}

/* -------------------------------------------- */

/**
 * Enforce spaces inside the parentheses of control-flow statements.
 * Applies to: if, for, while, switch, and catch.
 */
class SpaceInControlFlowParens extends BaseRule {

  /**
   * @type {Rule.RuleMetaData}
   */
  static meta = {
    fixable: "whitespace",
    messages: {
      missingCloseSpace: "Expected a space before ')'.",
      missingOpenSpace: "Expected a space after '('."
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
      CatchClause: this.#onCatchClause.bind(this),
      DoWhileStatement: this.#onDoWhileStatement.bind(this),
      ForInStatement: this.#checkAfterKeyword.bind(this),
      ForOfStatement: this.#checkAfterKeyword.bind(this),
      ForStatement: this.#checkAfterKeyword.bind(this),
      IfStatement: this.#onIfStatement.bind(this),
      SwitchStatement: this.#onSwitchStatement.bind(this),
      WhileStatement: this.#onWhileStatement.bind(this)
    };
  }

  /* -------------------------------------------- */

  /**
   * Check parens following the first keyword token of a node.
   * @param {object} node
   */
  #checkAfterKeyword(node) {
    const open = this.#openAfterKeyword(this.src.getFirstToken(node));
    if ( !open ) return;
    const close = this.#matchingClose(open);
    if ( close ) this.#checkParens(open, close);
  }

  /* -------------------------------------------- */

  /**
   * Check parens immediately surrounding an expression node.
   * @param {object} expr
   */
  #checkAroundExpr(expr) {
    const open = this.src.getTokenBefore(expr);
    const close = this.src.getTokenAfter(expr);
    if ( isOpenParen(open) && isCloseParen(close) ) this.#checkParens(open, close);
  }

  /* -------------------------------------------- */

  /**
   * Check that the open paren has a trailing space and the close paren has a leading space.
   * @param {AST.Token} open
   * @param {AST.Token} close
   */
  #checkParens(open, close) {
    const first = this.src.getTokenAfter(open);
    const last = this.src.getTokenBefore(close);
    if ( first && (first !== close) ) this.#checkSpace(open, first, "missingOpenSpace");
    if ( last && (last !== open) ) this.#checkSpace(last, close, "missingCloseSpace");
  }

  /* -------------------------------------------- */

  /**
   * Report and fix a missing space between two adjacent tokens.
   * @param {AST.Token} before
   * @param {AST.Token} after
   * @param {string} messageId
   */
  #checkSpace(before, after, messageId) {
    if ( after.range[0] === before.range[1] ) {
      this.context.report({
        messageId,
        fix: fixer => fixer.insertTextAfter(before, " "),
        loc: before.loc
      });
    }
  }

  /* -------------------------------------------- */

  /**
   * Find the matching ')' for a given '(' token by depth-counting through tokens.
   * @param {AST.Token} open
   * @returns {AST.Token|null}
   */
  #matchingClose(open) {
    let depth = 1;
    let tok = open;
    while ( depth ) {
      tok = this.src.getTokenAfter(tok);
      if ( !tok ) return null;
      if ( isOpenParen(tok) ) depth++;
      else if ( isCloseParen(tok) ) depth--;
    }
    return tok;
  }

  /* -------------------------------------------- */

  /**
   * Handle catch clause.
   * @param {object} node
   */
  #onCatchClause(node) {
    if ( node.param ) this.#checkAfterKeyword(node);
  }

  /* -------------------------------------------- */

  /**
   * Handle do-while statement.
   * @param {object} node
   */
  #onDoWhileStatement(node) {
    this.#checkAroundExpr(node.test);
  }

  /* -------------------------------------------- */

  /**
   * Handle if-statement.
   * @param {object} node
   */
  #onIfStatement(node) {
    this.#checkAroundExpr(node.test);
  }

  /* -------------------------------------------- */

  /**
   * Handle switch statement.
   * @param {object} node
   */
  #onSwitchStatement(node) {
    this.#checkAroundExpr(node.discriminant);
  }

  /* -------------------------------------------- */

  /**
   * Handle while statement.
   * @param {object} node
   */
  #onWhileStatement(node) {
    this.#checkAroundExpr(node.test);
  }

  /* -------------------------------------------- */

  /**
   * Return the '(' token immediately following a keyword token, or null.
   * @param {AST.Token|null} [keyword]
   * @returns {AST.Token|null}
   */
  #openAfterKeyword(keyword) {
    if ( !keyword ) return null;
    const t = this.src.getTokenAfter(keyword);
    return isOpenParen(t) ? t : null;
  }

}

/* -------------------------------------------- */

export default SpaceInControlFlowParens.rule();

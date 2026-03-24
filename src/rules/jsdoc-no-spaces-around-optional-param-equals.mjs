/**
 * @import { Rule } from 'eslint'
 */

import { BaseRule } from "./base.mjs";

/**
 * Matches spaces immediately before or after = inside [...] brackets.
 */
const SPACED_EQUALS_RE = /\s=|=\s/;

/**
 * Enforce no spaces around = in JSDoc optional parameter defaults.
 * E.g. [foo="bar"] not [foo = "bar"].
 */
class JsdocNoSpacesAroundOptionalParamEquals extends BaseRule {

  /**
   * @type {Rule.RuleMetaData}
   */
  static meta = {
    fixable: "whitespace",
    messages: {
      spacedEquals: "Unexpected spaces around = in JSDoc optional parameter."
    },
    schema: [],
    type: "layout"
  };

  /* -------------------------------------------- */

  /** @override */
  _listeners() {
    return {
      Program: this.#onProgram.bind(this)
    };
  }

  /* -------------------------------------------- */

  /**
   * Return [start, end] index pairs for each `[...]` bracket group in text that contains `=` and is
   * preceded by a closing type brace `}` (i.e., a JSDoc optional param, not inline description text).
   * Indices point to the content inside the brackets.
   * @param {string} text
   * @returns {[number, number][]}
   */
  #bracketRanges(text) {
    const ranges = [];
    let i = 0;
    while ( i < text.length ) {
      if ( text[i] !== "[" ) { i++; continue; }
      if ( !text.slice(0, i).trimEnd().endsWith("}") ) { i++; continue; }
      const start = i + 1;
      const close = text.indexOf("]", start);
      if ( close === -1 ) break;
      const content = text.slice(start, close);
      if ( content.includes("=") ) ranges.push([start, close]);
      i = close + 1;
    }
    return ranges;
  }

  /* -------------------------------------------- */

  /**
   * Scan a single JSDoc block comment for spaced = inside optional parameter brackets.
   * @param {object} comment
   */
  #checkJsdocComment(comment) {
    const value = comment.value;
    const base = comment.range[0] + 2; // Skip the opening /*
    for ( const [start, end] of this.#bracketRanges(value) ) {
      const content = value.slice(start, end);
      if ( !SPACED_EQUALS_RE.test(content) ) continue;
      const fixed = content.replace(/\s*=\s*/g, "=");
      const m = SPACED_EQUALS_RE.exec(content);
      this.context.report({
        fix: fixer => fixer.replaceTextRange([base + start, base + end], fixed),
        loc: this.src.getLocFromIndex(base + start + m.index),
        messageId: "spacedEquals"
      });
    }
  }

  /* -------------------------------------------- */

  /**
   * Handle program node - scan all JSDoc comments in the file.
   * @param {object} node
   */
  #onProgram(node) {
    for ( const comment of this.src.getAllComments() ) {
      if ( (comment.type !== "Block") || !comment.value.startsWith("*") ) continue;
      this.#checkJsdocComment(comment);
    }
  }

}

/* -------------------------------------------- */

export default JsdocNoSpacesAroundOptionalParamEquals.rule();

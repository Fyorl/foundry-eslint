/**
 * @import { Rule } from 'eslint'
 */

import { BaseRule } from "./base.mjs";

/**
 * Enforce no spaces around the pipe character in JSDoc union types.
 * E.g. `string|number` not `string | number`.
 */
class NoSpacesInUnionTypes extends BaseRule {

  /**
   * @type {Rule.RuleMetaData}
   */
  static meta = {
    fixable: "whitespace",
    messages: {
      spacedPipe: "Unexpected spaces around | in JSDoc union type."
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
      Program: this.#onProgram.bind(this)
    };
  }

  /* -------------------------------------------- */

  /**
   * Scan a single JSDoc block comment for spaced pipes inside type expressions.
   * @param {object} comment
   */
  #checkJsdocComment(comment) {
    const value = comment.value;
    const base = comment.range[0] + 2; // Skip the opening /*
    for ( const [start, end] of this.#typeRanges(value) ) {
      const content = value.slice(start, end);
      if ( !/\s\||\|\s/.test(content) ) continue;
      const fixed = content.replace(/\s*\|\s*/g, "|");
      const m = /\s\||\|\s/.exec(content);
      this.context.report({
        fix: fixer => fixer.replaceTextRange([base + start, base + end], fixed),
        loc: this.src.getLocFromIndex(base + start + m.index),
        messageId: "spacedPipe"
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

  /* -------------------------------------------- */

  /**
   * Return [start, end] index pairs for each `{...}` type expression in text, handling nested braces. Indices point to
   * the content inside the braces.
   * @param {string} text
   * @returns {[number, number][]}
   */
  #typeRanges(text) {
    const ranges = [];
    let depth = 0;
    let start = -1;
    for ( let i = 0; i < text.length; i++ ) {
      if ( text[i] === "{" ) {
        if ( !depth ) start = i + 1;
        depth++;
      } else if ( text[i] === "}" ) {
        depth--;
        if ( !depth && (start !== -1) ) {
          ranges.push([start, i]);
          start = -1;
        }
      }
    }
    return ranges;
  }

}

/* -------------------------------------------- */

export default NoSpacesInUnionTypes.rule();

/**
 * @import { Rule } from 'eslint'
 */

/**
 * Base class for custom ESLint rules.
 * Subclasses must define a static meta property, and implement _listeners().
 */
export class BaseRule {

  /**
   * @param {Rule.RuleContext} context
   */
  constructor(context) {
    this.#context = context;
    this.#src = context.sourceCode;
  }

  /* -------------------------------------------- */

  /**
   * Return the ESLint rule descriptor object for this rule class.
   * @returns {{ create: (context: Rule.RuleContext) => Rule.RuleListener, meta: Rule.RuleMetaData }}
   */
  static rule() {
    return { create: context => new this(context)._listeners(), meta: this.meta };
  }

  /* -------------------------------------------- */

  /**
   * The current linting context.
   * @type {Rule.RuleContext}
   */
  #context;

  /* -------------------------------------------- */

  /**
   * The source code object for the file being linted.
   * @type {Rule.RuleContext["sourceCode"]}
   */
  #src;

  /* -------------------------------------------- */

  /**
   * The current linting context.
   * @type {Rule.RuleContext}
   */
  get context() {
    return this.#context;
  }

  /* -------------------------------------------- */

  /**
   * The source code object for the file being linted.
   * @type {Rule.RuleContext["sourceCode"]}
   */
  get src() {
    return this.#src;
  }

  /* -------------------------------------------- */

  /**
   * Build and return the AST visitor map. Must be implemented by subclasses.
   * @returns {Rule.RuleListener}
   * @abstract
   * @protected
   */
  _listeners() {
    throw new Error(`${this.constructor.name} must implement _listeners()`);
  }

}

/**
 * @import { Rule } from 'eslint'
 */

import { BaseRule } from "./base.mjs";

/**
 * Enforce that object properties are ordered shorthand-first then alphabetically.
 * E.g. `{ abc, def, bar: 'baz', foo: 'bar' }`.
 * Skips objects containing spread elements or computed keys.
 */
class SortObjectKeys extends BaseRule {

  /**
   * @type {Rule.RuleMetaData}
   */
  static meta = {
    fixable: "code",
    messages: {
      unsorted: "Object properties must be sorted: shorthand properties first, then alphabetical."
    },
    schema: [],
    type: "layout"
  };

  /* -------------------------------------------- */

  /** @override */
  _listeners() {
    return {
      ObjectExpression: this.#onObjectExpression.bind(this)
    };
  }

  /* -------------------------------------------- */

  /**
   * Compare two property nodes for sort order: shorthand before non-shorthand, alphabetical within each group.
   * @param {object} a
   * @param {object} b
   * @returns {number}
   */
  #compareProps(a, b) {
    if ( a.shorthand !== b.shorthand ) return a.shorthand ? -1 : 1;
    const aName = this.#getKeyName(a);
    const bName = this.#getKeyName(b);
    if ( (aName === null) || (bName === null) ) return 0;
    return aName.localeCompare(bName);
  }

  /* -------------------------------------------- */

  /**
   * Return the string key name of a property node, or null for computed keys.
   * @param {object} prop
   * @returns {string|null}
   */
  #getKeyName(prop) {
    if ( prop.key.type === "Identifier" ) return prop.key.name;
    if ( prop.key.type === "Literal" ) return String(prop.key.value);
    return null;
  }

  /* -------------------------------------------- */

  /**
   * Handle object expression node.
   * @param {object} node
   */
  #onObjectExpression(node) {
    const props = node.properties;
    if ( props.some(p => (p.type === "SpreadElement") || p.computed) ) return;
    const sorted = [...props].sort(this.#compareProps.bind(this));
    const firstWrong = props.findIndex((p, i) => p !== sorted[i]);
    if ( firstWrong === -1 ) return;
    this.context.report({
      fix: fixer => sorted.map((p, i) => fixer.replaceText(props[i], this.src.getText(p))),
      messageId: "unsorted",
      node: props[firstWrong]
    });
  }

}

/* -------------------------------------------- */

export default SortObjectKeys.rule();

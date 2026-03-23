import noSpacesInUnionTypes from "./rules/no-spaces-in-union-types.mjs";
import requireMethodSeparator from "./rules/require-method-separator.mjs";
import sortObjectKeys from "./rules/sort-object-keys.mjs";
import spaceInControlFlowParens from "./rules/space-in-control-flow-parens.mjs";

export default {
  rules: {
    "no-spaces-in-union-types": noSpacesInUnionTypes,
    "require-method-separator": requireMethodSeparator,
    "sort-object-keys": sortObjectKeys,
    "space-in-control-flow-parens": spaceInControlFlowParens
  }
};

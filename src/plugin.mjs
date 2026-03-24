import jsdocNoSpacesAroundOptionalParamEquals from "./rules/jsdoc-no-spaces-around-optional-param-equals.mjs";
import noSpacesAroundDefaultParamEquals from "./rules/no-spaces-around-default-param-equals.mjs";
import requireArrowBraces from "./rules/require-arrow-braces.mjs";
import requireMethodSeparator from "./rules/require-method-separator.mjs";
import sortObjectKeys from "./rules/sort-object-keys.mjs";
import spaceInControlFlowParens from "./rules/space-in-control-flow-parens.mjs";

export default {
  rules: {
    "jsdoc-no-spaces-around-optional-param-equals": jsdocNoSpacesAroundOptionalParamEquals,
    "no-spaces-around-default-param-equals": noSpacesAroundDefaultParamEquals,
    "require-arrow-braces": requireArrowBraces,
    "require-method-separator": requireMethodSeparator,
    "sort-object-keys": sortObjectKeys,
    "space-in-control-flow-parens": spaceInControlFlowParens
  }
};

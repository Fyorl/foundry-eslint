import foundry from "./index.mjs";

export default [
  { ignores: ["test/fixtures/**"] },
  ...foundry.configs.recommended
];

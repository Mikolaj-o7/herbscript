import { tokenize } from "./lexer.js";
import { parse } from "./parser.js";
import { checkTypes } from "./typechecker.js";
import { emit } from "./emitter.js";

export function compile(source) {
  const tokens = tokenize(source);
  const ast = parse(tokens);
  checkTypes(ast);
  return emit(ast);
}

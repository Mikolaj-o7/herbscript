export function checkTypes(ast) {
  const env = new Map();

  function infer(node) {
    if (!node) return null;

    switch (node.type) {
      case "NumberLiteral": return "number";
      case "StringLiteral": return "string";
      case "Identifier": return env.get(node.name);
      case "BinaryExpression": {
        const lt = infer(node.left);
        const rt = infer(node.right);
        if (lt !== rt) throw new Error(`Type error: ${lt} ${node.operator} ${rt}`);
        return lt;
      }
      default:
        throw new Error(`Unknown node type: ${node?.type}`);
    }
  }

  for (const stmt of ast.body) {
    if (stmt.type === "VariableDeclaration") {
      if (stmt.value) {
        const valType = infer(stmt.value);
        if (stmt.varType !== valType) {
          throw new Error(
            `Type error: variable '${stmt.name}' declared as ${stmt.varType}, but assigned ${valType}`
          );
        }
      }

      env.set(stmt.name, stmt.varType);
    }
  }
}

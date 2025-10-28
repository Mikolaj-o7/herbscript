export function checkTypes(ast) {
  const env = new Map();

  function infer(node) {
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
      default: throw new Error(`Unknown node's type ${node.type}`);
    }
  }

  for (const stmt of ast.body) {
    if (stmt.type === "VariableDeclaration") {
      const valType = infer(stmt.value);
      if (stmt.varType !== valType) {
        throw new Error(`Type error: ${stmt.name} is of ${stmt.varType} type, but provided ${valType}`);
      }
      env.set(stmt.name, stmt.varType);
    }
  }
}

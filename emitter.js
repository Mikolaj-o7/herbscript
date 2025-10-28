export function emit(ast) {
  let out = "";
  for (const stmt of ast.body) {
    if (stmt.type === "VariableDeclaration") {
      out += `let ${stmt.name} = ${emitExpr(stmt.value)};\n`;
    }
  }
  return out;
}

function emitExpr(node) {
  switch (node.type) {
    case "NumberLiteral": return node.value;
    case "StringLiteral": return `"${node.value}"`;
    case "Identifier": return node.name;
    case "BinaryExpression": return `${emitExpr(node.left)} ${node.operator} ${emitExpr(node.right)}`;
    default: throw new Error(`Invalid node: ${node.type}`);
  }
}

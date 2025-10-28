export function emit(ast) {
  let out = "";

  for (const stmt of ast.body) {
    switch (stmt.type) {
      case "VariableDeclaration":
        if (stmt.value) {
          out += `${stmt.isConst ? "const" : "let"} ${stmt.name} = ${emitExpr(stmt.value)};\n`;
        } else {
          out += `${stmt.isConst ? "const" : "let"} ${stmt.name};\n`;
        }
        break;

      case "AssignmentExpression":
        out += `${stmt.name} = ${emitExpr(stmt.value)};\n`;
        break;

      default:
        throw new Error(`Unknown statement type: ${stmt.type}`);
    }
  }

  return out;
}

function emitExpr(node) {
  switch (node.type) {
    case "NumberLiteral": return node.value;
    case "StringLiteral": return `"${node.value}"`;
    case "BooleanLiteral": return node.value;
    case "Identifier": return node.name;
    case "BinaryExpression":
      return `${emitExpr(node.left)} ${node.operator} ${emitExpr(node.right)}`;
    default:
      throw new Error(`Invalid node: ${node.type}`);
  }
}

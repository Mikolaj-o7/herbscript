export function checkTypes(ast) {
  const env = new Map();

  function infer(node) {
    if (!node) return null;

    switch (node.type) {
      case "NumberLiteral": return "number";
      case "StringLiteral": return "string";
      case "BooleanLiteral": return "bool";
      case "Identifier": {
        const entry = env.get(node.name);
        if (!entry) throw new Error(`Variable '${node.name}' not declared`);
        if (!entry.initialized) throw new Error(`Variable '${node.name}' used before assignment`);
        return entry.type;
      }
      case "BinaryExpression": {
        const lt = infer(node.left);
        const rt = infer(node.right);
        if (lt !== rt) throw new Error(`Type error: ${lt} ${node.operator} ${rt}`);
        return lt;
      }
      case "AssignmentExpression": {
        const entry = env.get(node.name);
        if (!entry) throw new Error(`Variable '${node.name}' not declared`);
        const valType = infer(node.value);
        if (entry.type !== valType) throw new Error(
          `Type error: variable '${node.name}' is of type ${entry.type}, but assigned ${valType}`
        );
        entry.initialized = true; // mark as initialized
        return valType;
      }
      default:
        throw new Error(`Unknown node type: ${node?.type}`);
    }
  }

  for (const stmt of ast.body) {
    switch (stmt.type) {
      case "VariableDeclaration": {
        if (env.has(stmt.name)) {
          throw new Error(`Variable '${stmt.name}' is already declared`);
        }

        if (stmt.value) {
          const valType = infer(stmt.value);
          if (stmt.varType !== valType) {
            throw new Error(
              `Type error: variable '${stmt.name}' declared as ${stmt.varType}, but assigned ${valType}`
            );
          }
        }

        env.set(stmt.name, {
          type: stmt.varType,
          initialized: !!stmt.value,
          isConst: stmt.isConst
        });

        break;
      }

      case "AssignmentExpression": {
        const entry = env.get(stmt.name);
        if (!entry) throw new Error(`Variable '${stmt.name}' not declared`);
        if (entry.isConst)
          throw new Error(`Cannot reassign to constant variable '${stmt.name}'`);

        infer(stmt); // will handle type checking inside
        break;
      }

      default:
        throw new Error(`Unknown statement type: ${stmt.type}`);
    }
  }
}

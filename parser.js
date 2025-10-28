export function parse(tokens) {
  let i = 0;

  const peek = () => tokens[i];
  const consume = (type) => {
    const token = tokens[i];
    
    if (!token || token.type !== type) throw new Error(`Expected ${type}, but got ${token?.type}`);
    i++;

    return token;
  }

  const parsePrimary = () => {
    const token = peek();

    if (token.type === "NUMBER") { i++; return { type: "NumberLiteral", value: Number(token.value) }; }
    if (token.type === "STRING") { i++; return { type: "StringLiteral", value: token.value }; }
    if (token.type === "IDENT") { i++; return { type: "Identifier", name: token.value }; }

    throw new Error(`Unexpected token: ${token.type}`);
  }

  const parseExpression = () => {
    let left = parsePrimary();

    while (peek() && ["PLUS", "MINUS"].includes(peek().type)) {
      const op = consume(peek().type).value;
      const right = parsePrimary();
      left = { type: "BinaryExpression", operator: op, left, right };
    }
    
    return left;
  };

  const parseVariableDeclaration = () => {
    consume("LET");
    const name = consume("IDENT").value;
    consume("COLON");
    const type = consume("TYPE").value;
    
    if (type === "void") {
      throw new Error("Variables cannot be of void type.");
    }

    let value = null;

    // optional initialization
    if (peek() && peek().type === "EQUAL") {
      consume("EQUAL");
      value = parseExpression();
    }

    consume("SEMICOLON");

    return { type: "VariableDeclaration", name, varType: type, value };
  };

  const body = [];

  while (i < tokens.length) {
    if (peek().type === "LET") body.push(parseVariableDeclaration());
    else throw new Error(`Unexpected token: ${peek().type}`);
  }

  return { type: "Program", body };
}
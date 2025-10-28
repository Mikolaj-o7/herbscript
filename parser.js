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
    if (token.type === "BOOLEAN") { i++; return { type: "BooleanLiteral", value: token.value === "true" }; }
    if (token.type === "IDENT") { i++; return { type: "Identifier", name: token.value }; }

    if (token.type === "LPAREN") {
      consume("LPAREN");
      const expr = parseExpression();
      consume("RPAREN");
      return expr;
    }

    throw new Error(`Unexpected token in primary: ${token.type}`);
  };

  // Parse * and / first
  const parseMultiplicative = () => {
    let left = parsePrimary();

    while (peek() && ["STAR", "SLASH"].includes(peek().type)) {
      const op = consume(peek().type).value;
      const right = parsePrimary();
      left = { type: "BinaryExpression", operator: op, left, right };
    }

    return left;
  };

  // Then + and -
  const parseAdditive = () => {
    let left = parseMultiplicative();

    while (peek() && ["PLUS", "MINUS"].includes(peek().type)) {
      const op = consume(peek().type).value;
      const right = parseMultiplicative();
      left = { type: "BinaryExpression", operator: op, left, right };
    }

    return left;
  };

  // Then <, >, <=, >=
  const parseComparison = () => {
    let left = parseAdditive();

    while (peek() && ["LT", "GT", "LTE", "GTE"].includes(peek().type)) {
      const op = consume(peek().type).value;
      const right = parseAdditive();
      left = { type: "BinaryExpression", operator: op, left, right };
    }

    return left;
  };

  // Then ==, !=
  const parseEquality = () => {
    let left = parseComparison();

    while (peek() && ["EQEQ", "NOTEQ"].includes(peek().type)) {
      const op = consume(peek().type).value;
      const right = parseComparison();
      left = { type: "BinaryExpression", operator: op, left, right };
    }

    return left;
  };

  // Entry point
  const parseExpression = () => parseEquality();

  const parseVariableDeclaration = () => {
    const keyword = consume(peek().type); // LET or CONST
    const isConst = keyword.type === "CONST";
    const name = consume("IDENT").value;
    consume("COLON");
    const type = consume("TYPE").value;

    if (type === "void") {
      throw new Error("Variables cannot be of void type.");
    }

    let value = null;

    if (peek() && peek().type === "EQUAL") {
      consume("EQUAL");
      value = parseExpression();
    }

    consume("SEMICOLON");

    if (isConst && !value) {
      throw new Error(`Const variable '${name}' must be initialized`);
    }

    return {
      type: "VariableDeclaration",
      name,
      varType: type,
      value,
      isConst
    };
  };

  const parseAssignment = () => {
    const token = consume("IDENT");
    const name = token.value;

    consume("EQUAL");
    const value = parseExpression();
    consume("SEMICOLON");

    return { type: "AssignmentExpression", name, value };
  }

  const body = [];

  while (i < tokens.length) {
    if (peek().type === "LET" || peek().type === "CONST") {
      body.push(parseVariableDeclaration());
    }
    else if (peek().type === "IDENT") {
      body.push(parseAssignment());
    }
    else {
      throw new Error(`Unexpected token: ${peek().type}`);
    }
  }

  return { type: "Program", body };
}
export function tokenize(input) {
  const tokens = [];
  let i = 0;

  const isLetter = (char) => /[a-zA-Z_]/.test(char);
  const isDigit = (char) => /[0-9]/.test(char);
  const skipWhitespace = () => { while (/\s/.test(input[i])) i++; };

  const BOOLEANS = ["true", "false"];
  const KEYWORDS = ["let", "const"];
  const TYPES = ["number", "string", "bool", "void"];

  while (i < input.length) {
    skipWhitespace();
    
    const char = input[i];
    if (!char) break;

    if (isLetter(char)) {
      let start = i;
      while (isLetter(input[i]) || isDigit(input[i])) i++;
      const word = input.slice(start, i);
      
      if (KEYWORDS.includes(word)) {
        tokens.push({ type: word.toUpperCase(), value: word });
      } else if (TYPES.includes(word)) {
        tokens.push({ type: "TYPE", value: word });
      } else if (BOOLEANS.includes(word)) {
        tokens.push({ type: "BOOLEAN", value: word });
      } else {
        tokens.push({ type: "IDENT", value: word });
      }
      continue;
    }

    if (isDigit(char)) {
      let start = i;
      while (isDigit(input[i])) i++;
      tokens.push({ type: "NUMBER", value: input.slice(start, i) });
      continue;
    }

    if (char === '"' || char === "'") {
      const quote = char;
      i++;
      let start = i;
      while (input[i] && input[i] !== quote) i++;
      tokens.push({ type: "STRING", value: input.slice(start, i) });
      i++;
      continue;
    }

    const SINGLE = {
      "=": "EQUAL",
      ":": "COLON",
      ";": "SEMICOLON",
      "+": "PLUS",
      "-": "MINUS",
      "*": "STAR",
      "/": "SLASH"
    };

    if (SINGLE[char]) {
      tokens.push({ type: SINGLE[char], value: char });
      i++;
      continue;
    }

    throw new Error(`Unexpected character '${char}'`);
  }

  return tokens;
}
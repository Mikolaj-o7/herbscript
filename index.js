import fs from "fs";
import { compile } from "./compiler.js";

async function main() {
  const PATH = process.argv[2];
  if (!PATH) {
    console.error(`Usage: ${process.argv[0]} ${process.argv[1]} <file>`);
    process.exit(1);
  }

  try {
    const content = await fs.promises.readFile(PATH, "utf8");
    const js = compile(content);
    console.log(js);
  } catch (error) {
    console.error("There was an error:", error.message);
  }
}

main();

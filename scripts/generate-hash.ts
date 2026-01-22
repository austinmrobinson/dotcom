#!/usr/bin/env npx ts-node

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

async function main() {
  const password = process.argv[2];

  if (!password) {
    console.log("Usage: npx ts-node scripts/generate-hash.ts <password>");
    console.log("");
    console.log("This will output a bcrypt hash that you can add to");
    console.log("your PAGE_PASSWORD_HASHES environment variable.");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  console.log("\nGenerated bcrypt hash:");
  console.log(hash);
  console.log(
    "\nAdd this to your PAGE_PASSWORD_HASHES env var as a JSON array:"
  );
  console.log(`PAGE_PASSWORD_HASHES='["${hash}"]'`);
  console.log("\nFor multiple passwords:");
  console.log(`PAGE_PASSWORD_HASHES='["${hash}","<other-hash>"]'`);
}

main();

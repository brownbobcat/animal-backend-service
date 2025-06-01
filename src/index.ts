import "dotenv/config";
import { checkCommands } from "./services/commands";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] as string;
  const nextArg = args[1];
  const restArgs = args.slice(2);

  await checkCommands(command, nextArg, ...restArgs);
}

main().catch((error) => {
  console.error("An unhandled error occurred:", error);
  process.exit(1);
});

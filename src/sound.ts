import { execSync } from "child_process";
import { join } from "path";

export function playSound(fileName: "todo.mp3" | "daily.mp3") {
  const filePath = join(__dirname, `./assets/${fileName}`);
  const playSoundCommand = `afplay ${filePath}`;
  execSync(playSoundCommand);
}

import { existsSync } from "node:fs";
import { join } from "node:path";

const publicDirectory = join(process.cwd(), "public");
export const imagePlaceholder = "/images/placeholder-trip.svg";

export function getPublicImageSrc(images?: string[]) {
  const image = images?.[0];

  if (!image) {
    return imagePlaceholder;
  }

  const publicPath = join(publicDirectory, image.replace(/^\//, ""));

  return existsSync(publicPath) ? image : imagePlaceholder;
}

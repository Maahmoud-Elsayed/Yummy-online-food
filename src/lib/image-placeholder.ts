import { getPlaiceholder } from "plaiceholder";

export async function getImagePlaceHolder(src: string) {
  try {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Error fetching image: ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    const { base64 } = await getPlaiceholder(buffer);

    return base64;
  } catch (error) {
    console.error("Error in getImagePlaceHolder:", error);
  }
}

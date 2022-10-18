export const IMAGE = `
  width
  height
  url
`;

export interface Image {
  width: number;
  height: number;
  url: string;
}

export type ImageType = "Profile" | "Cover" | "General";

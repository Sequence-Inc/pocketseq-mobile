import { IMAGE, Image, ImageType } from "./image";

export const PHOTO = `
  id
  isDefault
  mime
  type
  thumbnail {
    ${IMAGE}
  }
  small {
    ${IMAGE}
  }
  medium {
    ${IMAGE}
  }
  large {
    ${IMAGE}
  }
`;

export interface Photo {
  id: string;
  isDefault?: boolean;
  mime: string;
  type: ImageType;
  thumbnail: Image;
  small: Image;
  medium: Image;
  large: Image;
}

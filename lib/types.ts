export interface GofileResponse {
  status: string;
  data: {
    isOwner: boolean;
    isPassword: boolean;
    children: Record<string, GofileContent>; // `contents` ではなく `children`
    password?: string;
    token?: string;
  };
}


export interface GofileContent {
  id: string;
  name: string;
  type: string;
  size: number;
  link: string;
  thumbnail: string;
  createTime: number;
  mimetype: string;
  children?: Record<string, GofileContent>; // ここを修正
}


export interface FileWithPreview extends GofileContent {
  previewUrl: string;
}
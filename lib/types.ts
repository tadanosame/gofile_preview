export interface GofileResponse {
  status: string;
  data: {
    isOwner: boolean;
    isPassword: boolean;
    contents: Record<string, GofileContent>;
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
  createTime: number;
  mimetype: string;
}

export interface FileWithPreview extends GofileContent {
  previewUrl: string;
}
import { GofileResponse } from './types';

export async function fetchGofileData(url: string, password?: string): Promise<GofileResponse> {
  try {
    // Extract the content ID from the URL
    const contentId = extractContentId(url);
    if (!contentId) {
      throw new Error('Invalid Gofile URL');
    }

    // Fetch the data from Gofile API
    const apiUrl = `https://api.gofile.io/contents/${contentId}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const options: RequestInit = {
      method: 'GET',
      headers,
    };

    if (password) {
      options.headers = {
        ...headers,
        'Authorization': `Bearer ${password}`,
      };
    }

    const response = await fetch(apiUrl, options);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Gofile data:', error);
    throw error;
  }
}

export function extractContentId(url: string): string | null {
  // Handle different Gofile URL formats
  const patterns = [
    /gofile\.io\/d\/([a-zA-Z0-9]+)/,
    /gofile\.io\/\?c=([a-zA-Z0-9]+)/,
    /([a-zA-Z0-9]{6,})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function getFileIcon(mimetype: string): string {
  if (mimetype.startsWith('image/')) {
    return 'image';
  } else if (mimetype.startsWith('video/')) {
    return 'video';
  } else if (mimetype.startsWith('audio/')) {
    return 'music';
  } else if (mimetype.includes('pdf')) {
    return 'file-text';
  } else if (mimetype.includes('zip') || mimetype.includes('rar') || mimetype.includes('tar')) {
    return 'archive';
  } else if (mimetype.includes('text/')) {
    return 'file-text';
  } else {
    return 'file';
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function downloadFile(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

export async function downloadAllFiles(files: { url: string; filename: string }[]): Promise<void> {
  for (const file of files) {
    await downloadFile(file.url, file.filename);
    // Add a small delay between downloads to prevent browser throttling
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}
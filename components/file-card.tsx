"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, File, FileText, Image, Music, Video, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FileWithPreview } from "@/lib/types";
import { formatFileSize, downloadFile } from "@/lib/api";

interface FileCardProps {
  file: FileWithPreview;
}

export function FileCard({ file }: FileCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadFile(file.link, file.name);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getFileIcon = () => {
    const mimetype = file.mimetype.toLowerCase();
    if (mimetype.startsWith("image/")) {
      return <Image className="h-8 w-8" />;
    } else if (mimetype.startsWith("video/")) {
      return <Video className="h-8 w-8" />;
    } else if (mimetype.startsWith("audio/")) {
      return <Music className="h-8 w-8" />;
    } else if (mimetype.includes("pdf") || mimetype.includes("text/")) {
      return <FileText className="h-8 w-8" />;
    } else if (mimetype.includes("zip") || mimetype.includes("rar") || mimetype.includes("tar")) {
      return <Archive className="h-8 w-8" />;
    } else {
      return <File className="h-8 w-8" />;
    }
  };

  const renderPreview = () => {
    const mimetype = file.mimetype.toLowerCase();
    if (mimetype.startsWith("image/")) {
      return (
        <div className="relative h-32 w-full overflow-hidden rounded-t-lg">
          <img
            src={file.previewUrl || file.link}
            alt={file.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/600x400?text=No+Preview";
            }}
          />
        </div>
      );
    } else if (mimetype.startsWith("video/")) {
      return (
        <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-t-lg bg-muted">
          <Video className="h-12 w-12 text-muted-foreground" />
        </div>
      );
    } else {
      return (
        <div className="flex h-32 w-full items-center justify-center rounded-t-lg bg-muted">
          {getFileIcon()}
        </div>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden">
        {renderPreview()}
        <CardContent className="p-4">
          <h3 className="mb-1 line-clamp-1 font-medium">{file.name}</h3>
          <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={handleDownload} 
            disabled={isDownloading} 
            className="w-full"
            variant="default"
          >
            {isDownloading ? "Downloading..." : "Download"}
            {!isDownloading && <Download className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
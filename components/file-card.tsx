"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, File, FileText, Image, Music, Video, Archive, Play, AlertCircle, Loader2, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileWithPreview } from "@/lib/types";
import { formatFileSize, downloadFile } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";

interface FileCardProps {
  file: FileWithPreview;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export function FileCard({ file, isSelected = false, onToggleSelect }: FileCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

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

  const handlePlay = () => {
    // 動画や音声の場合は新しいタブで開く
    window.open(file.link, '_blank');
  };

  const handlePreviewImage = () => {
    // 画像の場合は新しいタブで開く
    if (file.mimetype.startsWith("image/")) {
      window.open(file.link, '_blank');
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setIsPlaying(false);
    setIsLoading(false);
    setLoadError(null);
  };

  const handleMediaError = (e: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement, Event>) => {
    console.error("Media loading error:", e);
    setLoadError("メディアの読み込みに失敗しました。");
    setIsLoading(false);
  };

  const handleMediaLoaded = () => {
    console.log("Media loaded successfully");
    setIsLoading(false);
    setLoadError(null);
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

  const renderMediaPlayer = () => {
    const mimetype = file.mimetype.toLowerCase();
    if (mimetype.startsWith("video/")) {
      return (
        <div className="relative w-full h-full">
          <video 
            controls 
            className={`w-full h-full object-contain ${isLoading ? 'invisible' : 'visible'}`}
            onError={handleMediaError}
            onLoadedData={handleMediaLoaded}
            onCanPlay={handleMediaLoaded}
            autoPlay
          >
            <source src={'https://gofile-proxy.tadasame.workers.dev/?url='+file.link} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          {loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/50 p-4 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-sm text-destructive">{loadError}</p>
            </div>
          )}
        </div>
      );
    } else if (mimetype.startsWith("audio/")) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <audio 
            controls 
            className={`w-full ${isLoading ? 'invisible' : 'visible'}`}
            onError={handleMediaError}
            onLoadedData={handleMediaLoaded}
            onCanPlay={handleMediaLoaded}
            autoPlay
          >
            <source src={'https://gofile-proxy.tadasame.workers.dev/?url='+file.link} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          {loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/50 p-4 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-sm text-destructive">{loadError}</p>
            </div>
          )}
        </div>
      );
    }
  };

  const renderPreview = () => {
    const mimetype = file.mimetype.toLowerCase();
    if (mimetype.startsWith("image/")) {
      return (
        <div className="relative h-32 w-full overflow-hidden rounded-t-lg">
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelect}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div 
            className="relative h-full w-full cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              handlePreviewImage();
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="h-6 w-6 text-white" />
            </div>
            <img
              src={file.thumbnail || file.link}
              alt={file.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/600x400?text=No+Preview";
              }}
            />
          </div>
        </div>
      );
    } else if (mimetype.startsWith("video/")) {
      return (
        <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-t-lg bg-muted">
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelect}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <Video className="h-12 w-12 text-muted-foreground" />
            {file.thumbnail && (
              <img
                src={file.thumbnail}
                alt="Video thumbnail"
                className="absolute h-full w-full object-cover opacity-50"
              />
            )}
          </div>
        </div>
      );
    } else if (mimetype.startsWith("audio/")) {
      return (
        <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-t-lg bg-muted">
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelect}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <Music className="h-12 w-12 text-muted-foreground" />
        </div>
      );
    } else {
      return (
        <div className="relative flex h-32 w-full items-center justify-center rounded-t-lg bg-muted">
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelect}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {getFileIcon()}
        </div>
      );
    }
  };

  const canPlay = file.mimetype.toLowerCase().startsWith("video/") || file.mimetype.toLowerCase().startsWith("audio/");

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Card 
          className={`h-full overflow-hidden cursor-pointer transition-colors hover:bg-accent/5 ${isSelected ? 'ring-2 ring-primary' : ''}`}
          onClick={onToggleSelect}
        >
          <div className="relative">
            {renderPreview()}
          </div>
          <CardContent className="p-4">
            <h3 className="mb-1 line-clamp-1 font-medium">{file.name}</h3>
            <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
          </CardContent>
          <CardFooter className="flex gap-2 p-4 pt-0" onClick={(e) => e.stopPropagation()}>
            {canPlay && (
              <Button
                onClick={handlePlay}
                variant="secondary"
                className="flex-1"
              >
                開く
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            )}
            <Button 
              onClick={handleDownload} 
              disabled={isDownloading} 
              className={canPlay ? "flex-1" : "w-full"}
              variant="default"
            >
              {isDownloading ? "開いています..." : "開く"}
              {!isDownloading && <ExternalLink className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-6">
          <DialogHeader>
            <DialogTitle className="pr-8">{file.name}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {file.mimetype.startsWith("video/") ? "ビデオプレイヤー" : "オーディオプレイヤー"}
            </DialogDescription>
          </DialogHeader>
          <div className="relative w-full h-[calc(90vh-8rem)] overflow-hidden">
            {renderMediaPlayer()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
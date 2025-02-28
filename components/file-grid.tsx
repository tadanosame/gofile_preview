"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileCard } from "@/components/file-card";
import { FileWithPreview } from "@/lib/types";
import { downloadAllFiles } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";

interface FileGridProps {
  files: FileWithPreview[];
}

export function FileGrid({ files }: FileGridProps) {
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const handleDownloadAll = async () => {
    try {
      setIsDownloadingAll(true);
      const filesToDownload = files.map(file => ({
        url: file.link,
        filename: file.name
      }));
      await downloadAllFiles(filesToDownload);
    } catch (error) {
      console.error("Error downloading files:", error);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedFiles.size === 0) return;

    try {
      setIsDownloadingAll(true);
      // 選択されたファイルのIDを配列に変換
      const selectedFileIds = Array.from(selectedFiles);
      // 選択されたファイルの情報を取得
      const filesToDownload = files
        .filter(file => selectedFileIds.includes(file.id))
        .map(file => ({
          url: file.link,
          filename: file.name
        }));

      console.log('Selected files to download:', filesToDownload);
      await downloadAllFiles(filesToDownload);
    } catch (error) {
      console.error("Error downloading selected files:", error);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    const newSelectedFiles = new Set(selectedFiles);
    if (newSelectedFiles.has(fileId)) {
      newSelectedFiles.delete(fileId);
    } else {
      newSelectedFiles.add(fileId);
    }
    setSelectedFiles(newSelectedFiles);
  };

  const toggleSelectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map(file => file.id)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold tracking-tight">Files ({files.length})</h2>
            {files.length > 0 && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedFiles.size === files.length && files.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm">
                  すべて選択
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleDownloadAll} 
            disabled={isDownloadingAll || files.length === 0}
            variant="outline"
            className="flex-1"
          >
            {isDownloadingAll ? "ダウンロード中..." : "すべてダウンロード"}
            {!isDownloadingAll && <Download className="ml-2 h-4 w-4" />}
          </Button>
          {selectedFiles.size > 0 && (
            <Button 
              onClick={handleDownloadSelected} 
              disabled={isDownloadingAll}
              variant="default"
              className="flex-1"
            >
              {isDownloadingAll ? "ダウンロード中..." : `選択したファイルをダウンロード (${selectedFiles.size})`}
              {!isDownloadingAll && <Download className="ml-2 h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {files.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {files.map((file) => (
              <FileCard 
                key={file.id} 
                file={file}
                isSelected={selectedFiles.has(file.id)}
                onToggleSelect={() => toggleFileSelection(file.id)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <p className="text-center text-muted-foreground">表示するファイルがありません</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
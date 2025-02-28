"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileCard } from "@/components/file-card";
import { FileWithPreview } from "@/lib/types";
import { downloadAllFiles } from "@/lib/api";

interface FileGridProps {
  files: FileWithPreview[];
}

export function FileGrid({ files }: FileGridProps) {
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const handleDownloadAll = async () => {
    try {
      setIsDownloadingAll(true);
      const filesToDownload = files.map(file => ({
        url: file.link,
        filename: file.name
      }));
      await downloadAllFiles(filesToDownload);
    } catch (error) {
      console.error("Error downloading all files:", error);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Files ({files.length})</h2>
        <Button 
          onClick={handleDownloadAll} 
          disabled={isDownloadingAll || files.length === 0}
          className="ml-auto"
        >
          {isDownloadingAll ? "Downloading..." : "Download All"}
          {!isDownloadingAll && <Download className="ml-2 h-4 w-4" />}
        </Button>
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
              <FileCard key={file.id} file={file} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <p className="text-center text-muted-foreground">No files to display</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileGrid } from "@/components/file-grid";
import { PasswordDialog } from "@/components/password-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { fetchGofileData, extractContentId } from "@/lib/api";
import { FileWithPreview, GofileContent } from "@/lib/types";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url") || "";
  
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  useEffect(() => {
    if (!url) {
      router.push("/");
      return;
    }

    const fetchData = async (password?: string) => {
      try {
        setIsLoading(true);
        setError("");

        const contentId = extractContentId(url);
        if (!contentId) {
          setError("Invalid Gofile URL");
          return;
        }

        const response = await fetchGofileData(url, password);
        
        if (response.status !== "ok") {
          setError("Failed to fetch data from Gofile");
          return;
        }

        if (response.data.isPassword && !password) {
          setIsPasswordProtected(true);
          setIsPasswordDialogOpen(true);
          return;
        }

        const fileList: FileWithPreview[] = Object.values(response.data.contents).map((content: GofileContent) => ({
          ...content,
          previewUrl: content.mimetype.startsWith("image/") ? content.link : ""
        }));

        setFiles(fileList);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please check the URL and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, router]);

  const handlePasswordSubmit = (password: string) => {
    setIsPasswordDialogOpen(false);
    fetchGofileData(url, password)
      .then(response => {
        if (response.status === "ok") {
          const fileList: FileWithPreview[] = Object.values(response.data.contents).map((content: GofileContent) => ({
            ...content,
            previewUrl: content.mimetype.startsWith("image/") ? content.link : ""
          }));
          setFiles(fileList);
          setIsPasswordProtected(false);
        } else {
          setError("Invalid password");
          setIsPasswordDialogOpen(true);
        }
      })
      .catch(error => {
        console.error("Error with password:", error);
        setError("Failed to authenticate. Please try again.");
        setIsPasswordDialogOpen(true);
      });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="h-6 w-6" />
            <span className="text-xl font-bold">Gofile Downloader</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <Button
            variant="outline"
            size="sm"
            className="mb-6"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-center text-muted-foreground">
                Loading files...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <p className="text-center text-destructive">{error}</p>
              <Button
                className="mt-4"
                onClick={() => router.push("/")}
              >
                Try Another URL
              </Button>
            </motion.div>
          ) : (
            <FileGrid files={files} />
          )}
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Gofile Downloader. All rights reserved.
          </p>
        </div>
      </footer>

      <PasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => {
          setIsPasswordDialogOpen(false);
          if (isPasswordProtected) {
            router.push("/");
          }
        }}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractContentId } from "@/lib/api";

export function UrlForm() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("GofileのURLを入力してください");
      return;
    }

    const contentId = extractContentId(url);
    if (!contentId) {
      setError("無効なGofile URLの形式です");
      return;
    }

    setIsLoading(true);
    router.push(`/preview?id=${contentId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Input
            type="text"
            placeholder="Gofile URLを入力 (例: https://gofile.io/d/abc123)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "読み込み中..." : "ファイルを表示"}
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </form>
    </motion.div>
  );
}
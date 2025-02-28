import { ThemeToggle } from "@/components/theme-toggle";
import { UrlForm } from "@/components/url-form";
import { Download } from "lucide-react";

export default function Home() {
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
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Download files from Gofile
            </h1>
            <p className="max-w-[46rem] text-muted-foreground sm:text-xl">
              Enter a Gofile URL to preview and download files. No registration required.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-lg">
            <UrlForm />
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Gofile Downloader. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
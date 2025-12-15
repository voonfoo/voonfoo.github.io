export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 border-t border-border">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        {/* Pixel decoration */}
        <div className="text-primary text-lg">&lt;/&gt;</div>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          &copy; {currentYear} Voon Foo. All rights reserved.
        </p>

        {/* Built with */}
        <p className="text-xs text-muted-foreground">
          Built with{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary"
          >
            Next.js
          </a>{" "}
          &amp;{" "}
          <a
            href="https://8bitcn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary"
          >
            8-bit vibes
          </a>
        </p>
      </div>
    </footer>
  );
}

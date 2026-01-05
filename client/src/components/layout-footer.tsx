import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MindMate. All rights reserved.
        </p>
        <p className="text-sm font-medium">
          Designed by <span className="text-primary">Waheed Aslam</span>
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/terms" className="hover:underline">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { setSfwCookie, getSfwCookie } from "@/actions/CookieActions";
import { useRouter, usePathname } from "next/navigation";

export function SfwToggle() {
  const [isSfw, setIsSfw] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"sfw" | "nsfw" | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadCookieValue = async () => {
      const cookieValue = await getSfwCookie();
      setIsSfw(cookieValue);
      setIsLoaded(true);
    };
    loadCookieValue();
  }, []);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const enableSfw = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    setIsSfw(true);
    await setSfwCookie("true");
    setAlertType("sfw");
    setShowAlert(true);

    // Skip reload on home page - it rarely has NSFW content
    if (pathname === "/" || window?.location?.pathname === "/") {
      setIsRefreshing(false);
      return;
    }

    // Use router.push with the current URL to trigger a soft refresh
    // This preserves search params without causing rate limiting
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname + window.location.search;
      router.push(currentPath);

      // Small delay to allow cookie to be set before refresh
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  const enableNsfw = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    setIsSfw(false);
    await setSfwCookie("false");
    setAlertType("nsfw");
    setShowAlert(true);

    // Skip reload on home page - it rarely has NSFW content
    if (pathname === "/" || window?.location?.pathname === "/") {
      setIsRefreshing(false);
      return;
    }

    // Use router.push with the current URL to trigger a soft refresh
    // This preserves search params without causing rate limiting
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname + window.location.search;
      router.push(currentPath);

      // Small delay to allow cookie to be set before refresh
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="space-y-4">
      {/* Alert notifications */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50 w-80">
          {alertType === "sfw" && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>SFW Mode Enabled</AlertTitle>
              <AlertDescription>Safe for work content is now active. NSFW content will be filtered out.</AlertDescription>
            </Alert>
          )}

          {alertType === "nsfw" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>NSFW Mode Enabled</AlertTitle>
              <AlertDescription>You now have access to mature content. Please browse responsibly.</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Toggle buttons */}
      <>
        {!isSfw && (
          <Button
            variant="outline"
            size="icon"
            onClick={enableSfw}
            className="relative"
            title="Currently in NSFW mode. Click to enable SFW mode."
            disabled={isRefreshing}
          >
            <ShieldAlert className="h-[1.2rem] w-[1.2rem] text-red-500" />
            <span className="sr-only">Enable SFW mode</span>
          </Button>
        )}

        {isSfw && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative"
                title="Currently in SFW mode. Click to enable NSFW mode."
                disabled={isRefreshing}
              >
                <ShieldCheck className="h-[1.2rem] w-[1.2rem] text-green-500" />
                <span className="sr-only">Enable NSFW mode</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Enable NSFW Content?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to enable content that may contain mature themes not suitable for all audiences. By
                  continuing, you confirm that you are of legal age to view such content in your jurisdiction.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={enableNsfw} className="bg-red-500 hover:bg-red-600">
                  I Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </>
    </div>
  );
}

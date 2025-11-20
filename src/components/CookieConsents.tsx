"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as React from "react";

// Define prop types
interface CookieConsentProps extends React.HTMLAttributes<HTMLDivElement> {
  onAcceptCallback?: () => void;
  description?: string;
  learnMoreHref?: string;
}

const CookieConsent = React.forwardRef<HTMLDivElement, CookieConsentProps>(
  (
    {
      onAcceptCallback = () => {},
      className,
      description = "We use a cookie to store a unique identifier (GUID) that helps our website function properly. This cookie does not contain personal information and is used solely to maintain your session and improve your experience. By continuing to use our site, you consent to the use of this cookie.",
      learnMoreHref = "#",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [hide, setHide] = React.useState(false);

    const handleAccept = React.useCallback(() => {
      setIsOpen(false);
      document.cookie =
        "cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
      setTimeout(() => {
        setHide(true);
      }, 700);
      onAcceptCallback();
    }, [onAcceptCallback]);

    React.useEffect(() => {
      try {
        setIsOpen(true);
        if (document.cookie.includes("cookieConsent=true")) {
          setIsOpen(false);
          setTimeout(() => {
            setHide(true);
          }, 700);
        }
      } catch (error) {
        console.warn("Cookie consent error:", error);
      }
    }, []);

    if (hide) return null;

    const containerClasses = cn(
      "fixed z-50 transition-all duration-700",
      !isOpen ? "translate-y-full opacity-0" : "translate-y-0 opacity-100",
      className
    );

    const commonWrapperProps = {
      ref,
      className: cn(
        containerClasses,
        "left-0 right-0 sm:left-4 bottom-4 w-full sm:max-w-3xl"
      ),
      ...props,
    };

    return (
      <div {...commonWrapperProps}>
        <Card className="mx-3 p-0 py-3 shadow-lg">
          <CardContent className="sm:flex grid gap-4 p-0 px-3.5">
            <CardDescription className="text-xs sm:text-sm flex-1">
              {description}
            </CardDescription>
            <div className="flex items-center gap-2 justify-end sm:gap-3">
              <Button onClick={handleAccept} size="sm" className="text-xs h-7">
                Accept
                <span className="sr-only sm:hidden">Accept</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

CookieConsent.displayName = "CookieConsent";
export { CookieConsent };
export default CookieConsent;

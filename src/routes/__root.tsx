/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { DefaultCatchBoundary } from "../components/DefaultCatchBoundary";
import { NotFound } from "../components/NotFound";
import appCss from "../styles/app.css?url";
import { seo } from "../utils/seo";
import { P } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { NavigationProgress } from "@/components/navigation-progress";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Vote Monitor | Commit Global",
        description: `An election monitoring tool for NGOs and electoral experts to receive, manage, and analyze observation reports.`,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#FDD20C" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <NavigationProgress />

      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html className="h-full bg-background">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-[calc(100vh-10rem)] bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <SiteHeader />

          <div className="container-wrapper">
            <div className="container py-6">
              <section>{children}</section>
            </div>
          </div>
          <footer>
            <div className="mx-auto max-w-7xl px-6 pb-8 lg:px-8 ">
              <Separator />
              <div>
                <P>&copy; 2025 Commit Global</P>
              </div>
            </div>
          </footer>
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
}

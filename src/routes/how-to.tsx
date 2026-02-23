import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { H1 } from "@/components/ui/typography";
import { createFileRoute } from "@tanstack/react-router";

import loginAsObserver from "@/assets/loginAsObserver.jpg";
import fillInCredentials from "@/assets/fillInCredentials.jpg";
// import startMonitoring from "@/assets/startMonitoring.jpg";
import startMonitoring from "@/assets/fillInCredentials.jpg";
import ZoomableImage from "@/components/ZoomableImage";

const steps = [
  { title: "1. Logging in as an observer", src: loginAsObserver, alt: "Login as observer" },
  { title: "2. Filling in the credentials", src: fillInCredentials, alt: "Filling in the credentials" },
  { title: "3. Starting monitoring", src: startMonitoring, alt: "Starting to monitor" },
] as const;

export const Route = createFileRoute('/how-to')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 text-center pb-4 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <H1>How to use the app</H1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-3">
          {steps.map(({ title, src, alt }) => (
            <Card key={title} className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 sm:px-4">
                <ZoomableImage
                  title={title}
                  src={src}
                  alt={alt}
                  className="w-full h-full object-contain bg-white cursor-pointer"
                  style={{ imageRendering: "pixelated" }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

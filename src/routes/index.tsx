import android from "@/assets/android.png";
import ios from "@/assets/ios.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { H1 } from "@/components/ui/typography";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const platforms = [
    {
      name: "Android",
      id: "android",
      href: "https://play.google.com/store/apps/details?id=org.commitglobal.votemonitor.app",
      image: android,
    },
    {
      name: "iOS",
      id: "ios",
      href: "https://apps.apple.com/us/app/votemonitor/id6774144458",
      image: ios,
    },
  ];

  return (
    <div className="isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 text-center pb-4 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <H1>Vote Monitor</H1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
          {platforms.map((platform) => (
            <Card className="w-full" key={platform.id}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  {platform.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  onClick={() => {
                    window.open(platform.href, "_blank");
                  }}
                  src={platform.image}
                  alt={platform.name}
                  className="w-96 h-96 cursor-pointer"
                />
              </CardContent>
            </Card>
          ))}

          {/* Full-width final card */}
          <Card className="w-full col-span-full">
            <CardHeader>
              <CardTitle>Ready to try it out?</CardTitle>
              <CardDescription>
                Don't worry we won't ask for your credit card details ;)
              </CardDescription>
              <CardAction>
                <Button asChild>
                  <Link to="/credentials">Get your credentials</Link>
                </Button>
              </CardAction>
            </CardHeader>
          </Card>
          <Card className="w-full col-span-full">
            <CardHeader>
              <CardTitle>Want to know more about Commit Global?</CardTitle>
              <CardDescription>
                Want to learn how we are taking care of the world's
                infrastructure for good.
              </CardDescription>
              <CardAction>
                <Button asChild variant="outline">
                  <a
                    href="https://commitglobal.org"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit us
                  </a>
                </Button>
              </CardAction>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

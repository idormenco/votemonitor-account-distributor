import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { getSupabaseServerClient } from "@/utils/supabase";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import Cookies from "js-cookie";
import { Check, Copy, EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const fetchCredentials = createServerFn({ method: "GET" })
  .inputValidator((d: string | undefined) => d)
  .handler(async ({ data: cookieHash }) => {
    const supabase = getSupabaseServerClient();

    if (!cookieHash) {
      return null;
    }

    const { data, error } = await supabase.rpc("claim_demo_account", {
      cookie: cookieHash,
    });

    if (error) {
      console.error(error);
      throw new Error("Failed to claim demo account");
    }

    return {
      email: data?.[0]?.email,
      password: data?.[0]?.password,
    };
  });

export const Route = createFileRoute("/credentials")({
  component: RouteComponent,
});

export const fetchCredentialsQueryOptions = () =>
  queryOptions({
    queryKey: ["credentials"],
    queryFn: () => {
      let hash = Cookies.get("session_id");
      if (!hash) {
        hash = uuidv4();
        Cookies.set("session_id", hash);
      }

      return fetchCredentials({ data: hash });
    },
  });
function RouteComponent() {
  const { data, isLoading } = useQuery(fetchCredentialsQueryOptions());

  const showCredentials = data?.email && data?.password;
  const { copy: copyEmail, isCopied: isEmailCopied } = useCopyToClipboard();
  const { copy: copyPassword, isCopied: isPasswordCopied } =
    useCopyToClipboard();

  const [showPassword, setShowPassword] = useState(false);

  if (isLoading) {
    // Display a loader while data is being fetched
    return (
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-xl shadow-xl border">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold">
              Fetching your credentials...
            </CardTitle>
            <CardDescription>
              Patience is a virtue. We are working on it.
            </CardDescription>
            <CardAction>
              <Button asChild variant="link" className="cursor-pointer">
                <Link to="/">Back</Link>
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent className="space-y-6 flex items-center justify-center">
            <Spinner className="size-10 loader " />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-xl shadow-xl border">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">
            {showCredentials ? "Your credentials" : "Oops!"}
          </CardTitle>
          <CardDescription>
            {showCredentials
              ? "Please keep your credentials safe and do not share them with anyone. We will deactivate them after 24 hours or after it is viewed."
              : "Looks like the universe decided to hide your credentials 😅. Try refreshing the page!"}
          </CardDescription>
          <CardAction>
            <Button asChild variant="link" className="cursor-pointer">
              <Link to="/">Back</Link>
            </Button>
          </CardAction>
        </CardHeader>

        {showCredentials && (
          <CardContent className="space-y-6">
            <InputGroup>
              <InputGroupInput
                id="email"
                placeholder={data?.email || ""}
                value={data?.email || ""}
                readOnly
              />
              <InputGroupAddon align="block-start">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>

                <InputGroupButton
                  variant="ghost"
                  aria-label="Copy"
                  title="Copy"
                  className="ml-auto rounded-full"
                  size="icon-xs"
                  onClick={() => {
                    copyEmail(data?.email || "");
                  }}
                >
                  {isEmailCopied ? <Check /> : <Copy />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>

            <InputGroup>
              <InputGroupInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={data?.password || ""}
                value={data?.password || ""}
                readOnly
              />
              <InputGroupAddon align="block-start">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="flex items-center gap-2 ml-auto">
                  <InputGroupButton
                    variant="ghost"
                    aria-label="Copy"
                    title="Copy"
                    className="ml-auto rounded-full"
                    size="icon-xs"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </InputGroupButton>
                  <InputGroupButton
                    variant="ghost"
                    aria-label="Copy"
                    title="Copy"
                    className="ml-auto rounded-full"
                    size="icon-xs"
                    onClick={() => {
                      copyPassword(data?.password || "");
                    }}
                  >
                    {isPasswordCopied ? <Check /> : <Copy />}
                  </InputGroupButton>
                </div>
              </InputGroupAddon>
            </InputGroup>
          </CardContent>
        )}
      </Card>

      <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
    </div>
  );
}

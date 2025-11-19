import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { getSupabaseServerClient } from "@/utils/supabase";
import {
  queryOptions,
  skipToken,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const fetchCredentials = createServerFn({ method: "GET" })
  .inputValidator((d: string) => d)
  .handler(async ({ data: cookieHash }) => {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.rpc("claim_demo_account", {
      cookie: cookieHash,
    });

    console.log(cookieHash);
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

export const fetchCredentialsQueryOptions = (hash: string | undefined) =>
  queryOptions({
    queryKey: ["credentials", hash],
    queryFn: () => (hash ? () => fetchCredentials({ data: hash! }) : skipToken),
    enabled: !!hash,
  });

function RouteComponent() {
  const [cookieHash, setCookieHash] = useState<string | undefined>(undefined);

  useEffect(() => {
    let hash = Cookies.get("session_id");
    if (!hash) {
      hash = uuidv4();
      Cookies.set("session_id", hash);
    }

    setCookieHash(hash);
  }, []);

  const {
    data: { email, password },
  } = useSuspenseQuery(fetchCredentialsQueryOptions(cookieHash));

  const showCredentials = email && password;

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
            <label className="text-sm font-medium">Email</label>
            <Input type="email" value={email} readOnly />

            <label className="text-sm font-medium">Password</label>
            <PasswordInput value={password} readOnly />
          </CardContent>
        )}
      </Card>
    </div>
  );
}

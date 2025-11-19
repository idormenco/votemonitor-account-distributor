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
import { createFileRoute, Link } from "@tanstack/react-router";
import Cookies from "js-cookie";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createServerFn } from "@tanstack/react-start";

export const fetchPost = createServerFn({ method: "GET" })
  .inputValidator((d: string) => d)
  .handler(async ({ data: cookieHash }) => {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.rpc("claim_demo_account", {
      cookie: cookieHash,
    });
    console.log(data, error);
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
  loader: async () => {
    let cookieHash = Cookies.get("session_id");
    if (!cookieHash) {
      cookieHash = uuidv4();
      Cookies.set("session_id", cookieHash, { expires: 7 });
    }

    return fetchPost({ data: cookieHash! });
  },
});
function RouteComponent() {
  const { email, password } = Route.useLoaderData();

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

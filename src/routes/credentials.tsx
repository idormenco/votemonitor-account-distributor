import { Icons } from "@/components/Icons";
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
import { Spinner } from "@/components/ui/spinner";
import { getSupabaseServerClient } from "@/utils/supabase";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import Cookies from "js-cookie";
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
            <label className="text-sm font-medium">Email</label>
            <Input type="email" value={data?.email} readOnly />

            <label className="text-sm font-medium">Password</label>
            <PasswordInput value={data?.password} readOnly />
          </CardContent>
        )}
      </Card>
    </div>
  );
}

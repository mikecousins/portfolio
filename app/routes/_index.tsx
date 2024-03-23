import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { userPrefs } from "~/cookie.server";

export const meta: MetaFunction = () => {
  return [
    { title: "XEQT Portfolio Value" },
    { name: "description", content: "Calculate the value of your XEQT portfolio" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};

  return json({ portfolio: cookie.shares * 30.13 });
}

export default function Index() {
  const { portfolio } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>${portfolio ?? 'NaN'}</h1>
      <Link to="/settings">Settings</Link>
    </div>
  );
}

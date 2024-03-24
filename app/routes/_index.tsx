import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { userPrefs } from "~/cookie.server";

export const meta: MetaFunction = () => {
  return [
    { title: "XEQT Portfolio Value" },
    {
      name: "description",
      content: "Calculate the value of your XEQT portfolio",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};

  if (!cookie.shares) return redirect("/settings");

  const response = await fetch(
    "https://www.blackrock.com/ca/investors/en/products/309480/ishares-core-equity-etf-portfolio"
  );
  const body = await response.text();
  const spanLocation = body.indexOf('<span class="header-nav-data">');
  const priceElement = body.substring(spanLocation, spanLocation + 50);
  const rawPrice = priceElement.substring(35, 40);
  const price = Number(rawPrice);

  return json({ portfolio: cookie.shares * price });
}

export default function Index() {
  const { portfolio } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>${portfolio ?? "NaN"}</h1>
      <Link to="/settings">Settings</Link>
    </div>
  );
}

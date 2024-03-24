import { CogIcon } from "@heroicons/react/24/outline";
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

  return json({ total: cookie.shares * price, price, quantity: cookie.shares });
}

export default function Index() {
  const { total, price, quantity } = useLoaderData<typeof loader>();
  return (
    <div className="h-screen text-gray-700 flex flex-col justify-center items-center gap-x-2">
      <div className="text-lime-500 text-4xl font-bold">
        {new Intl.NumberFormat("en-CA", {
          style: "currency",
          currency: "CAD",
        }).format(total)}
      </div>
      <div className="italic">
        (
        {new Intl.NumberFormat("en-CA", {
          style: "currency",
          currency: "CAD",
        }).format(price)}{" "}
        x {quantity})
      </div>
      <div>
        <Link to="/settings">
          <CogIcon className="h-4 w-4 text-gray-800" />
        </Link>
      </div>
    </div>
  );
}

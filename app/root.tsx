import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "~/tailwind.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                window.counterscale = {
                  q: [["set", "siteId", "xeqt"], ["trackPageview"]],
                };
            })();`,
          }}
        />
        <script
          id="counterscale-script"
          src="https://counterscale.cousins.ai/tracker.js"
          defer
        ></script>
      </head>
      <body className="bg-gray-950">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

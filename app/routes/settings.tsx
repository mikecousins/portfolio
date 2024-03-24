import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useActionData, useLoaderData } from "@remix-run/react";
import { getFormProps, useForm } from "@conform-to/react";
import { z } from "zod";
import { userPrefs } from "~/cookie.server";
import { parseWithZod } from "@conform-to/zod";

const schema = z.object({
  shares: z.number(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  return json({ shares: cookie.shares });
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply(), {
      status: submission.status === "error" ? 400 : 200,
    });
  }

  const { shares } = submission.value;
  cookie.shares = shares;

  return redirect("/", {
    headers: {
      "Set-Cookie": await userPrefs.serialize(cookie),
    },
  });
}

export default function Settings() {
  const { shares: defaultShares } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const [form, { shares }] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });
  return (
    <div className="text-gray-300 h-screen flex flex-col justify-center items-center gap-2">
      <form
        method="post"
        {...getFormProps(form)}
        className="flex flex-col gap-2"
      >
        <label>
          # Shares Of XEQT
          <div>
            <input
              type="text"
              name="shares"
              defaultValue={defaultShares}
              className="bg-gray-900"
            />
          </div>
        </label>
        {shares.errors && <span>{shares.errors}</span>}
        <button type="submit" className="border p-1 rounded">
          Save
        </button>
      </form>
    </div>
  );
}

import { ActionFunction, json } from "@remix-run/node";
import { getContext } from "~/use-cases/http/utils";
import vippsPipelineChanges from "~/use-cases/payments/vipps/vippsPipelineChanges";
import { getStoreFront } from "~/use-cases/storefront.server";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }
  const requestContext = getContext(request);
  const { secret: storefront } = await getStoreFront(requestContext.host);
  const payload = await request.json();

  const vippsPipelines = await vippsPipelineChanges(
    payload.order,
    storefront.config
  );

  return json({ message: "Message received. Over.", payload }, 200);
};

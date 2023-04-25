import { NextResponse } from "next/server";
import { getContext } from "~/use-cases/http/utils";
import { getStoreFront } from "~/use-cases/storefront.server";

export async function GET(request: Request, response: Response) {
    // console.log('GET /api/cart', request);
    // const requestContext = getContext(request);
    // const { secret: storefront } = await getStoreFront(requestContext.host);
    // const body = await request.json();

    // return new Response('test')
    console.log('GET /api/cart', request);

    return new Response('test')

}
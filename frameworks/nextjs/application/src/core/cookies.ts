import { NextRequest, NextResponse } from 'next/server';
export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Setting cookies in the request.
    // This will be forwarded to api handler or getServerSideProps
    // depending on the route.

    res.cookies.set('authentication', 'isLoggedInOnServiceApiToken', {
        maxAge: 604_800,
    });
    return res;
}

import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { getSession } from '@/libs/auth/session';

import { AllLocales, AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

const PROTECTED_PATTERNS = [
  /^\/dashboard/,
  /^\/[^/]+\/dashboard/,
  /^\/onboarding/,
  /^\/[^/]+\/onboarding/,
  /^\/api/,
  /^\/[^/]+\/api/,
];

function isProtectedRoute(req: NextRequest) {
  return PROTECTED_PATTERNS.some(pattern => pattern.test(req.nextUrl.pathname));
}

export default async function middleware(
  request: NextRequest,
  _event: NextFetchEvent,
) {
  if (isProtectedRoute(request)) {
    const session = await getSession();
    if (!session) {
      const signInUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|monitoring).*)', '/', '/(api|trpc)(.*)'], // Also exclude tunnelRoute used in Sentry from the matcher
};

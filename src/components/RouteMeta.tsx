import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { metaFor } from '../routes';

/** Keeps the tab title and description in sync with the current page. */
export function RouteMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = metaFor(pathname);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [pathname]);
  return null;
}

import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

export interface DesignSystemBreadcrumbItem {
  href: string;
  label: string;
}

export interface DesignSystemBreadcrumbProps {
  /**
   * An ordered list of breadcrumb items. When provided, syncWithUrl is ignored.
   */
  items?: DesignSystemBreadcrumbItem[];
  /**
   * Whether to sync breadcrumbs from the current URL path when items prop is not provided.
   * Defaults to true.
   */
  syncWithUrl?: boolean;
  /**
   * When using SSR, pass the current path (e.g. from `usePathname()` or context) here.
   * Falls back to `window.location.pathname` on client.
   */
  currentPath?: string;
  /**
   * Maximum number of items to display before collapsing.
   */
  maxItems?: number;
  /**
   * Number of items to show before the collapsed items.
   */
  itemsBeforeCollapse?: number;
  /**
   * Number of items to show after the collapsed items.
   */
  itemsAfterCollapse?: number;
  /**
   * Callback fired before collapsing items.
   */
  beforeCollapse?: () => void;
  /**
   * Callback fired after collapsing items.
   */
  afterCollapse?: () => void;
  /**
   * Custom separator icon or element between items.
   */
  separator?: React.ReactNode;
  /**
   * Additional CSS class names for the root breadcrumb container.
   */
  className?: string;
}

/**
 * DesignSystemBreadcrumb
 *
 * Wraps shadcn/ui's Breadcrumb with:
 * - Explicit control over URL syncing via syncWithUrl prop
 * - Full SSR support via currentPath prop
 * - Collapsible middle items similar to MUI
 * - Hooks for beforeCollapse and afterCollapse
 * - ARIA attributes for accessibility
 */
export const DesignSystemBreadcrumb: React.FC<DesignSystemBreadcrumbProps> = ({
  items,
  syncWithUrl = true,
  currentPath,
  maxItems = 8,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  beforeCollapse,
  afterCollapse,
  separator,
  className,
}) => {
  const listId = React.useId();

  // Determine path string using SSR-friendly prop or window
  const pathStr = React.useMemo(() => {
    if (currentPath) return currentPath;
    if (typeof window !== 'undefined' && window.location.pathname) {
      return window.location.pathname;
    }
    return '';
  }, [currentPath]);

  // Build items from URL path if syncing is enabled
  const pathItems = React.useMemo<DesignSystemBreadcrumbItem[]>(() => {
    if (!syncWithUrl || !pathStr) return [];
    const parts = pathStr.split('/').filter(Boolean);
    return parts.map((part, idx) => ({
      href: `/${parts.slice(0, idx + 1).join('/')}`,
      label: decodeURIComponent(part.charAt(0).toUpperCase() + part.slice(1)),
    }));
  }, [syncWithUrl, pathStr]);

  // Determine source of items
  const rawItems = items && items.length ? items : syncWithUrl ? pathItems : [];

  const [collapsed, setCollapsed] = React.useState(false);
  const shouldCollapse = maxItems < rawItems.length;

  let displayItems = rawItems;
  if (shouldCollapse && !collapsed) {
    const start = rawItems.slice(0, itemsBeforeCollapse);
    const end = rawItems.slice(-itemsAfterCollapse);
    displayItems = [...start, { href: '', label: '__COLLAPSE__' }, ...end];
  }

  const toggleCollapse = () => {
    beforeCollapse?.();
    setCollapsed(!collapsed);
    afterCollapse?.();
  };

  return (
    <nav className={className} aria-label="Breadcrumb">
      <Breadcrumb as="ol" id={listId}>
        {displayItems.map((item, idx) =>
          item.label === '__COLLAPSE__' ? (
            <BreadcrumbItem key="collapse">
              <button
                type="button"
                onClick={toggleCollapse}
                aria-expanded={collapsed}
                aria-controls={listId}
                aria-label={
                  collapsed
                    ? 'Collapse breadcrumb items'
                    : 'Expand breadcrumb items'
                }
                className="inline-flex items-center space-x-1 text-muted-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem key={idx} as="li">
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              {idx < displayItems.length - 1 && (
                <BreadcrumbSeparator>
                  {separator ?? (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </BreadcrumbSeparator>
              )}
            </BreadcrumbItem>
          )
        )}
      </Breadcrumb>
    </nav>
  );
};

export default DesignSystemBreadcrumb;

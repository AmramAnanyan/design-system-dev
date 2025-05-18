import { Fragment, useMemo, type FC, type ReactNode } from 'react';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

export interface IBreadCrumbItem {
  href: string;
  label: string;
}

export interface IBreadCrumbP {
  items: IBreadCrumbItem[];
  syncWithUrl?: boolean;
  className?: string;
  separator?: ReactNode;
  linkComponent: { render: (args: IBreadCrumbItem) => JSX.Element };
}

interface IGenerateBreadcrumbs {
  syncWithUrl: boolean;
  currentPath?: string;
  crumbs: IBreadCrumbItem[];
}
const useGenerateBreadcrumbs = ({
  syncWithUrl,
  currentPath,
  crumbs,
}: IGenerateBreadcrumbs) => {
  const pathStr = useMemo(() => {
    if (currentPath) return currentPath;
    if (typeof window !== 'undefined' && window.location.pathname) {
      return window.location.pathname;
    }
    return '';
  }, [currentPath]);

  const pathItems = useMemo<IBreadCrumbItem[]>(() => {
    if (!syncWithUrl || !pathStr) return crumbs;
    const parts = pathStr.split('/').filter(Boolean);
    return parts.map((part, idx) => ({
      href: `/${parts.slice(0, idx + 1).join('/')}`,
      label: decodeURIComponent(part.charAt(0).toUpperCase() + part.slice(1)),
    }));
  }, [syncWithUrl, pathStr]);
  return { breadCrumbItems: pathItems };
};

const BreadCrumbP: FC<IBreadCrumbP> = ({
  items = [],
  className = '',
  separator,
  linkComponent,
  syncWithUrl = false,
}: IBreadCrumbP) => {
  const { breadCrumbItems } = useGenerateBreadcrumbs({
    syncWithUrl,
    crumbs: items,
  });

  return (
    <Breadcrumb
      aria-label="breadcrumb"
      data-section-group="breadcrumb-list"
      className={className}
    >
      <BreadcrumbList
        data-section="breadcrumb"
        itemType="https://schema.org/BreadcrumbList"
      >
        {breadCrumbItems.map((item, index) => {
          const isLast = index === breadCrumbItems.length - 1;

          return (
            <Fragment key={index}>
              <BreadcrumbItem
                itemProp="itemListElement"
                itemType="https://schema.org/ListItem"
              >
                <BreadcrumbEllipsis className="h-4 w-4" />
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    {linkComponent.render(item)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbP;

import { useState } from 'react';

import './App.css';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import DesignSystemBreadcrumb from './components/designbread';
import BreadCrumbP from './components/breadcrumbprod/BreadCrumbP';
import { Slash } from 'lucide-react';
import { NavLink, Link } from 'react-router';

const CRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Components', href: '/components' },
  { label: 'BreadCrumb', href: '/breadcrumb' },
];

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DesignSystemBreadcrumb />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="/">Home</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="/docs/components">Components</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}

      <hr />
      <BreadCrumbP
        items={CRUMBS}
        linkComponent={{
          render: (item) => {
            console.log(item, 'hhhhhh');
            return (
              <Link to={item.href} className="underline">
                {item.label}
              </Link>
            );
          },
        }}
        syncWithUrl
      />
    </>
  );
}

export default App;

"use client";

import Link from 'next/link';
import { ReactElement } from 'react';

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

const NavLink = ({ href, icon: Icon, label }: NavLinkProps): ReactElement => (
  <Link href={href} className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
    <Icon className="h-4 w-4" />
    <span>{label}</span>
  </Link>
);

export default NavLink;
'use client'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface NavLinkProps {
  href: string
  icon: LucideIcon
  label: string
  onClick?: () => void // Added onClick prop
}

export default function NavLink({ href, icon: Icon, label, onClick }: NavLinkProps) {
  return (
    <Link 
      href={href} 
      className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors duration-200 hover:bg-gray-100 px-3 py-2 rounded-md"
      onClick={onClick} // Trigger the onClick handler when the link is clicked
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  )
}

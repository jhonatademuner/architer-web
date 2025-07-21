import * as icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export function iconConverter(iconName: string | null | undefined) {
  if (!iconName) return null;

  const Icon = icons[iconName as keyof typeof icons] as LucideIcon | undefined;

  if (!Icon) {
    console.warn(`Lucide icon "${iconName}" not found.`);
    return null;
  }

  return <Icon className="w-5 h-5" />;
}

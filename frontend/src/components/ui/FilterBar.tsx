'use client';

import { ReactNode } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from './Button';

interface FilterBarProps {
  children: ReactNode;
  onClear: () => void;
  hasFilters: boolean;
}

export function FilterBar({ children, onClear, hasFilters }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <Filter className="h-4 w-4 text-gray-500" />
      {children}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-3 w-3" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
}

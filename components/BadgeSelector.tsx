
import React from 'react';
import { Badge } from '../types';
import { TagIcon } from './icons';

interface BadgeSelectorProps {
  availableBadges: Badge[];
  selectedBadges: Badge[];
  onToggleBadge: (badge: Badge) => void;
}

export const BadgeSelector: React.FC<BadgeSelectorProps> = ({ availableBadges, selectedBadges, onToggleBadge }) => {
  const categorizedBadges: Record<string, Badge[]> = availableBadges.reduce((acc, badge) => {
    acc[badge.category] = [...(acc[badge.category] || []), badge];
    return acc;
  }, {} as Record<string, Badge[]>);

  return (
    <div>
      <h3 className="text-lg font-medium text-slate-300 mb-3 flex items-center">
        <TagIcon className="w-5 h-5 mr-2 text-secondary" /> Select Badges
      </h3>
      {Object.entries(categorizedBadges).map(([category, badges]) => (
        <div key={category} className="mb-4">
          <p className="text-sm font-semibold text-slate-400 mb-2">{category}</p>
          <div className="flex flex-wrap gap-2">
            {badges.map(badge => {
              const isSelected = selectedBadges.some(sb => sb.id === badge.id);
              return (
                <button
                  key={badge.id}
                  type="button"
                  onClick={() => onToggleBadge(badge)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 ease-in-out border
                    ${isSelected
                      ? 'bg-primary border-primary text-white shadow-md'
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-slate-500'
                    }`}
                >
                  {badge.selectorDisplay}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
    
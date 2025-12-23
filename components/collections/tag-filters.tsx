/**
 * Tag Filters Component
 * 
 * Filter UI for collections/themes browsing
 * Tag-based filtering (safety level, budget, wellness, etc.)
 */

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Tag = {
  id: string;
  label: string;
  count?: number;
};

type TagFiltersProps = {
  tags: Tag[];
  selectedTags?: string[];
  onTagToggle?: (tagId: string) => void;
  className?: string;
};

export function TagFilters({
  tags,
  selectedTags = [],
  onTagToggle,
  className,
}: TagFiltersProps) {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedTags);

  const handleToggle = (tagId: string) => {
    if (onTagToggle) {
      onTagToggle(tagId);
    } else {
      setLocalSelected((prev) =>
        prev.includes(tagId)
          ? prev.filter((id) => id !== tagId)
          : [...prev, tagId]
      );
    }
  };

  const isSelected = (tagId: string) => {
    return onTagToggle
      ? selectedTags.includes(tagId)
      : localSelected.includes(tagId);
  };

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {tags.map((tag) => {
        const selected = isSelected(tag.id);
        return (
          <button
            key={tag.id}
            onClick={() => handleToggle(tag.id)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors",
              selected
                ? "bg-brand-blue1 text-white hover:bg-brand-blue2"
                : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
            )}
          >
            {tag.label}
            {tag.count !== undefined && (
              <span className="ml-2 text-sm opacity-75">({tag.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}


"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Input } from "@/src/elements/ui/input";
import { Permission, PermissionSubmodule } from "@/src/types/store";
import { Check, Minus, Search, ShieldCheck } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

const CustomCheckbox = memo(({ checked, indeterminate }: { checked: boolean; indeterminate?: boolean }) => {
  return (
    <div
      className={`relative h-4 w-4 shrink-0 rounded border transition-all flex items-center justify-center
        ${checked || indeterminate ? "bg-primary border-primary text-white shadow-sm" : "bg-white dark:bg-(--card-color) border-slate-300 dark:border-(--card-border-color) group-hover:border-primary"}`}
    >
      {checked && !indeterminate && <Check className="h-3 w-3 stroke-[4px]" />}
      {indeterminate && <Minus className="h-3 w-3 stroke-[4px]" />}
    </div>
  );
});
CustomCheckbox.displayName = "CustomCheckbox";

const SubmoduleItem = memo(({ sub, isSelected, onToggle }: { sub: PermissionSubmodule; isSelected: boolean; onToggle: (slug: string) => void }) => {
  return (
    <div
      className={`flex items-center gap-2 p-2.5 rounded-lg transition-all cursor-pointer group hover:bg-white dark:hover:bg-(--table-hover) border border-transparent 
        ${isSelected ? "bg-white dark:bg-page-body border-slate-100 dark:border-(--card-border-color) shadow-sm" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        onToggle(sub.slug);
      }}
    >
      <CustomCheckbox checked={isSelected} />
      <span className="text-xs font-medium text-slate-600 dark:text-gray-300 capitalize select-none flex-1 truncate">{sub.name.replace(/_/g, " ")}</span>
    </div>
  );
});
SubmoduleItem.displayName = "SubmoduleItem";

const ModuleCard = memo(({ perm, selectedSlugs, onToggleModule, onToggleSlug }: { perm: Permission; selectedSlugs: Set<string>; onToggleModule: (perm: Permission) => void; onToggleSlug: (slug: string) => void }) => {
  const slugsInModule = useMemo(() => perm.submodules.map((s) => s.slug), [perm.submodules]);
  const selectedInModule = useMemo(() => slugsInModule.filter((s) => selectedSlugs.has(s)), [slugsInModule, selectedSlugs]);

  const isAllSelected = slugsInModule.length > 0 && selectedInModule.length === slugsInModule.length;
  const isIndeterminate = !isAllSelected && selectedInModule.length > 0;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-page-body p-4 space-y-3 hover:border-primary/30 transition-all shadow-sm border-l-4 border-l-primary/20">
      <div
        className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-(--card-border-color) cursor-pointer group"
        onClick={(e) => {
          e.preventDefault();
          onToggleModule(perm);
        }}
      >
        <div className="flex items-center gap-2 flex-1 ml-3">
          <CustomCheckbox checked={isAllSelected} indeterminate={isIndeterminate} />
          <span className="text-sm font-bold capitalize text-slate-800 dark:text-white select-none transition-colors group-hover:text-primary">{perm.module.replace(/_/g, " ")}</span>
        </div>
        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {perm.submodules.map((sub) => (
          <SubmoduleItem key={sub.slug} sub={sub} isSelected={selectedSlugs.has(sub.slug)} onToggle={onToggleSlug} />
        ))}
      </div>
    </div>
  );
});
ModuleCard.displayName = "ModuleCard";

const PermissionPicker = ({ permissions = [], selectedSlugs = [], onChange }: { permissions: Permission[]; selectedSlugs: string[]; onChange: (slugs: string[]) => void }) => {
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState<Set<string>>(new Set(selectedSlugs));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelection(new Set(selectedSlugs));
  }, [selectedSlugs]);

  const filteredPermissions = useMemo(() => {
    if (!search.trim()) return permissions;
    const q = search.toLowerCase();
    return permissions
      .map((perm) => ({
        ...perm,
        submodules: perm.submodules.filter((sub) => perm.module.toLowerCase().includes(q) || sub.name.toLowerCase().includes(q) || sub.slug.toLowerCase().includes(q)),
      }))
      .filter((perm) => perm.submodules.length > 0);
  }, [permissions, search]);

  // Pre-calculate maps for dependent permission logic
  const { slugToViewSlugMap, viewSlugToOtherSlugsMap } = useMemo(() => {
    const slugToView: Record<string, string> = {};
    const viewToOthers: Record<string, string[]> = {};

    permissions.forEach((perm) => {
      const viewSub = perm.submodules.find((s) => s.name.toLowerCase() === "view");
      if (viewSub) {
        const others: string[] = [];
        perm.submodules.forEach((sub) => {
          slugToView[sub.slug] = viewSub.slug;
          if (sub.slug !== viewSub.slug) {
            others.push(sub.slug);
          }
        });
        viewToOthers[viewSub.slug] = others;
      }
    });

    return { slugToViewSlugMap: slugToView, viewSlugToOtherSlugsMap: viewToOthers };
  }, [permissions]);

  const onToggleSlug = useCallback(
    (slug: string) => {
      const next = new Set(selection);
      const viewSlug = slugToViewSlugMap[slug];

      if (next.has(slug)) {
        next.delete(slug);
        // If the one being deleted is the "view" slug, also delete all other permissions in this module
        if (slug === viewSlug) {
          const others = viewSlugToOtherSlugsMap[slug] || [];
          others.forEach((s) => next.delete(s));
        }
      } else {
        next.add(slug);
        // If any permission is selected, the "view" permission for that module MUST be selected
        if (viewSlug) {
          next.add(viewSlug);
        }
      }

      setSelection(next);
      onChange(Array.from(next));
    },
    [selection, onChange, slugToViewSlugMap, viewSlugToOtherSlugsMap]
  );

  const onToggleModule = useCallback(
    (perm: Permission) => {
      const slugsInModule = perm.submodules.map((s) => s.slug);
      const allSelected = slugsInModule.every((s) => selection.has(s));

      const next = new Set(selection);
      if (allSelected) {
        slugsInModule.forEach((s) => next.delete(s));
      } else {
        slugsInModule.forEach((s) => next.add(s));
      }

      setSelection(next);
      onChange(Array.from(next));
    },
    [selection, onChange]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search permissions..." className="pl-9 h-11 bg-(--input-color) dark:bg-page-body border-slate-200 dark:border-slate-800 transition-all focus:ring-1 focus:ring-primary" />
        </div>

        <div
          className={`flex items-center gap-2 text-xs text-muted-foreground transition-all 
          ${selection.size > 0 ? "opacity-100" : "opacity-0"}`}
        >
          <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20 font-bold px-3">
            {selection.size}
          </Badge>
          permission(s) selected
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-125 overflow-y-auto pr-2 custom-scrollbar p-1">
        {filteredPermissions.map((perm) => (
          <ModuleCard key={perm._id} perm={perm} selectedSlugs={selection} onToggleModule={onToggleModule} onToggleSlug={onToggleSlug} />
        ))}

        {filteredPermissions.length === 0 && <div className="col-span-full text-center py-20 text-muted-foreground text-sm bg-slate-50 dark:bg-page-body rounded-lg border border-dashed border-slate-200 dark:border-(--card-border-color)">No permissions found matching &quot;{search}&quot;</div>}
      </div>
    </div>
  );
};

export default PermissionPicker;

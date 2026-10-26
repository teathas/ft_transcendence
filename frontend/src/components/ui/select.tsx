"use client";

import { useId, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import ReactSelect, {
  components as defaultComponents,
  type GroupBase,
  type Props as ReactSelectProps,
} from "react-select";

import { cn } from "@/lib/utils";

/** Room the open list needs: `max-h-64` (256px) plus its padding and margin. */
const MENU_HEIGHT = 280;

export type SelectOption<Value extends string = string> = {
  value: Value;
  label: string;
};

/**
 * The single select control for the whole platform.
 *
 * react-select runs `unstyled`, so every pixel comes from our design tokens
 * instead of its default stylesheet — which means it themes with the rest of
 * the app, dark mode included.
 */
export function Select<
  Option = SelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  className,
  ...props
}: ReactSelectProps<Option, IsMulti, Group> & { className?: string }) {
  // react-select generates ids for its a11y wiring; a stable one keeps the
  // server and client markup identical.
  const instanceId = useId();

  // Opens upward when the screen has no room below. react-select's own "auto"
  // only looks at the page's scroll area, which a modal escapes, so a list
  // opened low in a modal ran off the bottom of the window.
  const wrapper = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");

  function choosePlacement() {
    const box = wrapper.current?.getBoundingClientRect();
    if (!box) return;
    const below = window.innerHeight - box.bottom;
    setPlacement(below < MENU_HEIGHT && box.top > below ? "top" : "bottom");
  }

  return (
    <div ref={wrapper} className={className}>
      <ReactSelect<Option, IsMulti, Group>
        instanceId={instanceId}
        unstyled
        menuPlacement={placement}
        onMenuOpen={choosePlacement}
        components={{
          DropdownIndicator: (indicatorProps) => (
            <defaultComponents.DropdownIndicator {...indicatorProps}>
              <ChevronDown className="size-4" aria-hidden="true" />
            </defaultComponents.DropdownIndicator>
          ),
          ClearIndicator: (indicatorProps) => (
            <defaultComponents.ClearIndicator {...indicatorProps}>
              <X className="size-3.5" aria-hidden="true" />
            </defaultComponents.ClearIndicator>
          ),
          Option: (optionProps) => (
            <defaultComponents.Option {...optionProps}>
              <span className="flex flex-1 items-center justify-between gap-2">
                {optionProps.children}
                {optionProps.isSelected && (
                  <Check className="size-3.5 text-primary" aria-hidden="true" />
                )}
              </span>
            </defaultComponents.Option>
          ),
        }}
        classNames={{
          container: () => "text-sm",
          control: ({ isFocused, isDisabled }) =>
            cn(
              "flex min-h-11 w-full cursor-pointer items-center gap-1 bg-background",
              "rounded-lg border px-3 shadow-xs transition-[color,box-shadow,border-color]",
              isFocused && "border-ring ring-[3px] ring-ring/35",
              isDisabled && "cursor-not-allowed opacity-50",
            ),
          valueContainer: () => "flex flex-wrap items-center gap-1 py-1",
          placeholder: () => "text-muted-foreground/70",
          singleValue: () => "text-foreground",
          multiValue: () =>
            "bg-muted text-foreground flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs",
          multiValueRemove: () =>
            "hover:text-destructive cursor-pointer transition-colors",
          input: () => "text-foreground",
          indicatorsContainer: () => "text-muted-foreground flex items-center",
          indicatorSeparator: () => "hidden",
          dropdownIndicator: () =>
            "hover:text-foreground cursor-pointer px-1 transition-colors",
          clearIndicator: () =>
            "hover:text-destructive cursor-pointer px-1 transition-colors",
          menu: () =>
            "bg-card z-50 mt-1.5 overflow-hidden rounded-lg border shadow-lg shadow-black/5 dark:shadow-black/40",
          menuList: () => "max-h-64 overflow-y-auto p-1",
          option: ({ isFocused, isSelected }) =>
            cn(
              "cursor-pointer rounded-md px-2.5 py-2 text-sm transition-colors",
              isFocused && "bg-accent text-accent-foreground",
              isSelected && "font-medium",
            ),
          groupHeading: () =>
            "text-muted-foreground px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide",
          noOptionsMessage: () => "text-muted-foreground px-2.5 py-3 text-sm",
        }}
        {...props}
      />
    </div>
  );
}

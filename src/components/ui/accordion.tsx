"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const AccordionContext = React.createContext<{
  value?: string | string[];
  onValueChange?: (value: string) => void;
}>({});

const AccordionItemContext = React.createContext<{ value: string }>({ value: "" });

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type?: "single" | "multiple";
    defaultValue?: string | string[];
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
  }
>(({ className, type = "single", defaultValue, value: controlledValue, onValueChange, ...props }, ref) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | string[]>(
    defaultValue ?? (type === "multiple" ? [] : "")
  );

  const value = controlledValue ?? uncontrolledValue;

  const handleValueChange = React.useCallback((itemValue: string) => {
    if (type === "multiple") {
      const prevArray = Array.isArray(value) ? value : [];
      const next = prevArray.includes(itemValue)
        ? prevArray.filter((v) => v !== itemValue)
        : [...prevArray, itemValue];
      
      if (controlledValue === undefined) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    } else {
      const next = value === itemValue ? "" : itemValue;
      if (controlledValue === undefined) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    }
  }, [type, value, controlledValue, onValueChange]);

  return (
    <AccordionContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div ref={ref} className={className} {...props} />
    </AccordionContext.Provider>
  );
});
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => (
  <AccordionItemContext.Provider value={{ value }}>
    <div
      ref={ref}
      className={cn("border-b", className)}
      {...props}
    />
  </AccordionItemContext.Provider>
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { value, onValueChange } = React.useContext(AccordionContext);
  const { value: itemValue } = React.useContext(AccordionItemContext);
  
  const isOpen = Array.isArray(value) ? value.includes(itemValue) : value === itemValue;

  return (
    <div className="flex">
      <button
        ref={ref}
        type="button"
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
        onClick={(e) => {
          onValueChange?.(itemValue);
          props.onClick?.(e);
        }}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </button>
    </div>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { value } = React.useContext(AccordionContext);
  const { value: itemValue } = React.useContext(AccordionItemContext);
  
  const isOpen = Array.isArray(value) ? value.includes(itemValue) : value === itemValue;

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "overflow-hidden text-sm transition-all animate-in slide-in-from-top-1",
        className
      )}
      {...props}
    >
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </div>
  )
})
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

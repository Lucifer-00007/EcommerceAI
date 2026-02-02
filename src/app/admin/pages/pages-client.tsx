"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  GripVertical, 
  MoreHorizontal, 
  Eye, 
  Edit3, 
  Globe, 
  FileText,
  Plus
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAdminSettings, updateAdminSettings } from "@/features/admin/api";
import { cn } from "@/lib/utils";

// Mock interface for the UI
interface PageItem {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft";
  type: "system" | "content";
  lastModified: string;
  settingKey?: "showAbout" | "showContact" | "showFaq" | "showPolicies";
}

export function AdminPagesClient() {
  const queryClient = useQueryClient();
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => getAdminSettings(),
  });

  const mutation = useMutation({
    mutationFn: async (patch: Record<string, unknown>) => updateAdminSettings(patch),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast.success("Page status updated");
    },
    onError: (e) => toast.error((e as Error)?.message ?? "Save failed"),
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Loading pages…</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load settings"
        description={String((error as Error)?.message ?? "")}
      />
    );
  }

  const settings = data?.settings.pages;
  if (!settings) return <EmptyState title="No settings" description="Try refreshing." />;

  // Transform settings to PageItems
  const pages: PageItem[] = [
    { id: "home", title: "Home", slug: "/", status: "published", type: "system", lastModified: "2 hours ago" },
    { id: "shop", title: "Shop", slug: "/shop", status: "published", type: "system", lastModified: "1 day ago" },
    { 
      id: "about", 
      title: "About Us", 
      slug: "/about", 
      status: settings.showAbout ? "published" : "draft", 
      type: "content", 
      lastModified: "3 days ago",
      settingKey: "showAbout"
    },
    { 
      id: "contact", 
      title: "Contact", 
      slug: "/contact", 
      status: settings.showContact ? "published" : "draft", 
      type: "content", 
      lastModified: "1 week ago",
      settingKey: "showContact"
    },
    { 
      id: "faq", 
      title: "FAQ", 
      slug: "/faq", 
      status: settings.showFaq ? "published" : "draft", 
      type: "content", 
      lastModified: "2 weeks ago",
      settingKey: "showFaq"
    },
    { 
      id: "policies", 
      title: "Legal Policies", 
      slug: "/policies", 
      status: settings.showPolicies ? "published" : "draft", 
      type: "content", 
      lastModified: "1 month ago",
      settingKey: "showPolicies"
    },
  ];

  const handleStatusToggle = (page: PageItem) => {
    if (page.settingKey) {
      mutation.mutate({ 
        pages: { 
          [page.settingKey]: page.status === "draft" 
        } 
      });
    } else {
      toast.info("System pages cannot be disabled");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pages</h2>
          <p className="text-sm text-muted-foreground">
            Manage your site structure, content, and SEO metadata.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Page
        </Button>
      </div>

      <div className="space-y-4">
        {pages.map((page) => (
          <Card key={page.id} className="group transition-all hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="cursor-move text-muted-foreground/50 hover:text-foreground">
                <GripVertical className="h-5 w-5" />
              </div>
              
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {page.type === "system" ? <Globe className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold leading-none truncate">{page.title}</h3>
                  {page.type === "system" && (
                    <Badge variant="secondary" className="text-[10px] h-5">System</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="font-mono">{page.slug}</span>
                  <span>•</span>
                  <span>Edited {page.lastModified}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs font-medium",
                    page.status === "published" ? "text-green-600" : "text-muted-foreground"
                  )}>
                    {page.status === "published" ? "Published" : "Draft"}
                  </span>
                  <Checkbox 
                    checked={page.status === "published"}
                    onCheckedChange={() => handleStatusToggle(page)}
                    disabled={page.type === "system" || mutation.isPending}
                  />
                </div>

                <div className="h-4 w-px bg-border mx-2" />

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingPage(page)}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingPage(page)}>
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={!!editingPage} onOpenChange={(open) => !open && setEditingPage(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Page: {editingPage?.title}</SheetTitle>
            <SheetDescription>
              Configure page settings and SEO metadata.
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input id="title" defaultValue={editingPage?.title} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <div className="flex items-center rounded-md border bg-muted/50 px-3">
                <span className="text-sm text-muted-foreground">/</span>
                <input 
                  className="flex h-10 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={editingPage?.slug.replace('/', '')}
                  id="slug"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>SEO Description</Label>
              <Textarea 
                placeholder="Enter a meta description for search engines..."
                className="resize-none"
                rows={4}
              />
              <p className="text-xs text-muted-foreground text-right">0 / 160 characters</p>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <h4 className="text-sm font-medium">Search Preview</h4>
              <div className="space-y-1">
                <div className="text-sm text-[#1a0dab] hover:underline cursor-pointer">
                  {editingPage?.title} | Lumina Store
                </div>
                <div className="text-xs text-[#006621]">
                  lumina.store{editingPage?.slug}
                </div>
                <div className="text-xs text-muted-foreground">
                  This is a preview of how your page might appear in search engine results. 
                  Add a description to control this snippet.
                </div>
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setEditingPage(null)}>Cancel</Button>
            <Button onClick={() => {
              toast.success("Changes saved");
              setEditingPage(null);
            }}>Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}


import Link from "next/link";
import { Facebook, Instagram, ShoppingBag, Twitter, Youtube } from "lucide-react";

import { Container } from "@/components/layout/container";
import { routes } from "@/lib/routes";
import { getSiteSettings } from "@/services/admin/settings-store";

export function SiteFooter() {
  const settings = getSiteSettings();
  const showPolicies = settings.pages.showPolicies;
  return (
    <footer className="border-t bg-card pt-16 pb-8">
      <Container className="text-sm text-muted-foreground">
        <div className="grid gap-10 xl:grid-cols-3 xl:gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold text-foreground">Lumina</span>
            </div>
            <p className="max-w-xs text-sm leading-6">
              Making modern lifestyle products accessible to everyone. Quality, comfort, and style
              in every package.
            </p>
            <div className="flex items-center gap-4">
              {settings.social.facebook ? (
                <Link
                  href={settings.social.facebook}
                  className="text-muted-foreground hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
              ) : null}
              {settings.social.instagram ? (
                <Link
                  href={settings.social.instagram}
                  className="text-muted-foreground hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              ) : null}
              {settings.social.x ? (
                <Link
                  href={settings.social.x}
                  className="text-muted-foreground hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
              ) : null}
              {settings.social.youtube ? (
                <Link
                  href={settings.social.youtube}
                  className="text-muted-foreground hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="h-5 w-5" />
                </Link>
              ) : null}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:col-span-2 xl:grid-cols-3">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Shop</p>
              <div className="flex flex-col gap-2">
                <Link href={routes.products} className="hover:text-primary">
                  Products
                </Link>
                <Link href={routes.cart} className="hover:text-primary">
                  Cart
                </Link>
                <Link href={routes.checkout} className="hover:text-primary">
                  Checkout
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Company</p>
              <div className="flex flex-col gap-2">
                {settings.pages.showAbout ? (
                  <Link href={routes.about} className="hover:text-primary">
                    About
                  </Link>
                ) : null}
                {settings.pages.showContact ? (
                  <Link href={routes.contact} className="hover:text-primary">
                    Contact
                  </Link>
                ) : null}
                {settings.pages.showFaq ? (
                  <Link href={routes.faq} className="hover:text-primary">
                    FAQ
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Legal</p>
              <div className="flex flex-col gap-2">
                {showPolicies ? (
                  <>
                    <Link href={routes.shippingReturns} className="hover:text-primary">
                      Shipping & returns
                    </Link>
                    <Link href={routes.privacy} className="hover:text-primary">
                      Privacy policy
                    </Link>
                    <Link href={routes.terms} className="hover:text-primary">
                      Terms
                    </Link>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <p>© {new Date().getFullYear()} Lumina. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

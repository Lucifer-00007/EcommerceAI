import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

import { Container } from "@/components/layout/container";
import { routes } from "@/lib/routes";
import { getSiteSettings } from "@/services/admin/settings-store";

export function SiteFooter() {
  const settings = getSiteSettings();
  const showPolicies = settings.pages.showPolicies;
  return (
    <footer className="border-t">
      <Container className="grid gap-8 py-10 text-sm text-muted-foreground md:grid-cols-4">
        <div className="space-y-2">
          <p className="font-medium text-foreground">EcommerceAI</p>
          <p>Modern storefront UX with typed data and mock APIs.</p>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-foreground">Shop</p>
          <div className="flex flex-col gap-2">
            <Link href={routes.products} className="hover:text-foreground">
              Products
            </Link>
            <Link href={routes.cart} className="hover:text-foreground">
              Cart
            </Link>
            <Link href={routes.checkout} className="hover:text-foreground">
              Checkout
            </Link>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-foreground">Company</p>
          <div className="flex flex-col gap-2">
            {settings.pages.showAbout ? (
              <Link href={routes.about} className="hover:text-foreground">
                About
              </Link>
            ) : null}
            {settings.pages.showContact ? (
              <Link href={routes.contact} className="hover:text-foreground">
                Contact
              </Link>
            ) : null}
            {settings.pages.showFaq ? (
              <Link href={routes.faq} className="hover:text-foreground">
                FAQ
              </Link>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-foreground">Legal</p>
          <div className="flex flex-col gap-2">
            {showPolicies ? (
              <>
                <Link href={routes.shippingReturns} className="hover:text-foreground">
                  Shipping & returns
                </Link>
                <Link href={routes.privacy} className="hover:text-foreground">
                  Privacy policy
                </Link>
                <Link href={routes.terms} className="hover:text-foreground">
                  Terms
                </Link>
              </>
            ) : null}
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="flex flex-col gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} EcommerceAI</p>
            <div className="flex items-center gap-3">
              {settings.social.instagram ? (
                <Link
                  href={settings.social.instagram}
                  className="hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
              ) : null}
              {settings.social.facebook ? (
                <Link
                  href={settings.social.facebook}
                  className="hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
              ) : null}
              {settings.social.x ? (
                <Link
                  href={settings.social.x}
                  className="hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
              ) : null}
              {settings.social.youtube ? (
                <Link
                  href={settings.social.youtube}
                  className="hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

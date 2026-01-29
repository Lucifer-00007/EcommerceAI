/**
 * Layout Components
 *
 * Components for page layout structure including header, footer, navigation,
 * and utility components like cart drawer and search bar.
 *
 * @module components/layout
 */

// Main Layout Components
export { Header } from "./header";
export { Footer } from "./footer";
export { Navigation, MobileNavigation } from "./navigation";

// Utility Components
export { CartDrawer } from "./cart-drawer";
export { SearchBar } from "./search-bar";
export { UserMenu, GuestUserMenu } from "./user-menu";
export { MobileMenu } from "./mobile-menu";

// Types
export type { SearchBarProps } from "./search-bar";
export type { UserMenuProps } from "./user-menu";
export type { MobileMenuProps } from "./mobile-menu";
export type { NavigationProps } from "./navigation";

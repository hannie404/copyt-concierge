import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <div className="h-[73px] md:hidden" aria-hidden="true" />
      {children}
      <Footer />
    </>
  );
}

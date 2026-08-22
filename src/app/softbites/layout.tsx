import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Softbites 云酥 | Handcrafted Soft-Baked Cookies",
  description:
    "Handcrafted soft-baked cookies made with love in Malaysia. Premium ingredients, no preservatives. Order now for delivery in Klang Valley!",
};

export default function SoftbitesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

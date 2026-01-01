import HeroLayout from "../_component/HeroLayout";
import SheetLayout from "../_component/SheetLayout";

export const runtime = "edge";
export const revalidate = 1;
export const metadata = {
  title: "ニュース",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeroLayout title="News" sub="ニュース" />
      <SheetLayout>{children}</SheetLayout>
    </>
  );
}

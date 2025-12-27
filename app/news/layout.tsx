import HeroLayout from "../_component/HeroLayout";
import SheetLayout from "../_component/SheetLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeroLayout title="News" sub="ニュース" />
      <SheetLayout>{children}</SheetLayout>
    </>
  );
}

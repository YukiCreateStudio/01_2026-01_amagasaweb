import HeroLayout from "../_component/HeroLayout";
import SheetLayout from "../_component/SheetLayout";
export const metadata = {
  title: "お問い合わせ",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeroLayout title="Contact" sub="お問い合わせ" />
      <SheetLayout>{children}</SheetLayout>
    </>
  );
}

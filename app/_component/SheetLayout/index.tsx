import styles from "./index.module.css";

type Props = {
  children: React.ReactNode;
};

export default function SheetLayout({ children }: Props) {
  return (
    <>
      <section className={styles.container}>{children}</section>
    </>
  );
}

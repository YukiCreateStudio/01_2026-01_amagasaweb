import Image from "next/image";
import styles from "./index.module.css";
import Link from "next/link";
import Menu from "../Menu";

export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <Link href={`/`} className={styles.logoLink}>
          <Image
            className={styles.logo}
            src="/logo.svg"
            alt=""
            width={341}
            height={109}
          />
        </Link>
        <Menu />
      </header>
    </>
  );
}

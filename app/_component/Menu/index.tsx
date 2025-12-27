"use client";

import Link from "next/link";
import styles from "./index.module.css";
import Image from "next/image";
import classNames from "classnames";
import { useState } from "react";

export default function Menu() {
  const [isOpen, setOpen] = useState(false);
  const open = () => setOpen(true);
  const close = () => setOpen(false);

  return (
    <>
      <nav className={classNames(styles.nav, isOpen && styles.open)}>
        <ul className={styles.items}>
          <li>
            <Link href={`/news`}>ニュース</Link>
          </li>
          <li>
            <Link href={`/members`}>メンバー</Link>
          </li>
          <li>
            <Link href={`/contact`}>お問い合わせ</Link>
          </li>
        </ul>
        <button
          className={classNames(styles.close, styles.button)}
          onClick={close}
        >
          <Image src="/close.svg" alt="" width={24} height={24} />
        </button>
      </nav>
      <button className={styles.button} onClick={open}>
        <Image src="/menu.svg" alt="" width={24} height={24} />
      </button>
    </>
  );
}

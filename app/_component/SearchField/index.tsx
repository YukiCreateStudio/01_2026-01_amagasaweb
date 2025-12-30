"use client";

import Image from "next/image";
import styles from "./index.module.css";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SearchFieldComponent() {
  const searchParams = useSearchParams();

  return (
    <>
      <form className={styles.form} action="/news/search" method="get">
        <label className={styles.search}>
          <Image src="/search.svg" alt="検索" width={16} height={16} />
          <input
            type="text"
            name="q"
            className={styles.searchInput}
            placeholder="キーワードを入力"
            defaultValue={searchParams.get(`q`) ?? undefined}
          />
        </label>
      </form>
    </>
  );
}

export default function SearchField() {
  return (
    <Suspense>
      <SearchFieldComponent />
    </Suspense>
  );
}

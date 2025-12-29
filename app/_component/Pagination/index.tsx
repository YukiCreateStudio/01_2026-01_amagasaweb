import { NEWS_LIMIT } from "@/app/_constants";
import styles from "./index.module.css";
import classNames from "classnames";
import Link from "next/link";

type Props = {
  totalCount: number;
  current?: number;
  basePath?:string;
};

export default function Pagination({ totalCount, current = 1,basePath=`/news` }: Props) {
  const pages = Array.from(
    { length: Math.ceil(totalCount / NEWS_LIMIT) },
    (_, i) => i + 1
  );


  return (
    <>
      <ul className={styles.container}>
        {pages.map((p) => (
          <li key={p} className={styles.list}>
            {current !== p ? (
              <Link href={`${basePath}/p/${p}`} className={styles.item}>
                {p}
              </Link>
            ) : (
              <span className={classNames(styles.item, styles.current)}>
                {p}
              </span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

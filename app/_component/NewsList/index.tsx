import { NewsType } from "@/dataType/type";
import Link from "next/link";
import styles from "./index.module.css";
import Image from "next/image";

type Props = {
  news: NewsType[];
};

export default function NewsList({ news }: Props) {
  console.log("news", news);
  return (
    <>
      <ul>
        {news.map((article) => (
          <li key={article.id} className={styles.list}>
            <Link href={`/news/${article.id}`} className={styles.link}>
              <dl>
                <dt className={styles.title}>{article.title}</dt>
                <dd className={styles.meta}>
                  <span></span>
                  <span>
                    <Image src="/clock.svg" alt="" width={16} height={16} />
                    {article.publishedAt ?? article.createdAt}
                  </span>
                </dd>
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

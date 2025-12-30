import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import ButtonLink from "./_component/ButtonLink";
import { getNewsList } from "@/data/microcms";
import NewsList from "./_component/NewsList";

export default async function Home() {
  const { contents: news } = await getNewsList({
    limit: 1,
  });
  return (
    <>
      <section className={styles.top}>
        <div>
          <h1 className={styles.title}>Title</h1>
          <p className={styles.description}>description</p>
        </div>
        <Image
          className={styles.bgimg}
          src="/img-mv.jpg"
          alt=""
          width={4000}
          height={1200}
        />
      </section>
      <section className={styles.news}>
        <h2 className={styles.newsTitle}>News</h2>
        <NewsList news={news} />
        <div className={styles.newsLink}>
          <ButtonLink href="/news">もっとみる</ButtonLink>
        </div>
      </section>
    </>
  );
}

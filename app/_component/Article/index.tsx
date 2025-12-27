import { NewsType } from "@/dataType/type";
import styles from "./index.module.css";
import Link from "next/link";
import CategoryTag from "../CategoryTag";
import DateTag from "../DateTag";
import Image from "next/image";

type Props = {
  news: NewsType;
};

export default function Article({ news }: Props) {
  return (
    <main>
      <h1 className={styles.title}>{news.title}</h1>
      <p className={styles.description}>{news.description}</p>
      <div className={styles.meta}>
        <Link
          href={`/news/category/${news.category.id}`}
          className={styles.categoryLink}
        >
          <CategoryTag category={news.category} />
        </Link>
        <DateTag date={news.publishedAt ?? news.createdAt} />
      </div>
      {news.thumbnail && (
        <Image
          className={styles.thumbnail}
          src={news.thumbnail.url}
          alt=""
          width={news.thumbnail.width}
          height={news.thumbnail.height}
        />
      )}
      <div
        dangerouslySetInnerHTML={{ __html: news.content }}
        className={styles.content}
      />
    </main>
  );
}

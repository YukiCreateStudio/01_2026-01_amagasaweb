import { NewsType } from "@/dataType/type";
import styles from "./index.module.css";

type Props = {
  news: NewsType;
};

export default function Article({ news }: Props) {
  console.log(news);
  return (
    <main>
      <h1 className={styles.title}>{news.title}</h1>
      <p className={styles.description}>{news.description}</p>
    </main>
  );
}

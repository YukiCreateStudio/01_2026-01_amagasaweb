import { CategoryType } from "@/dataType/type";
import styles from "./index.module.css";

type Props = {
  category: CategoryType;
};

export default function CategoryTag({ category }: Props) {
  return (
    <>
      <span className={styles.tag}>{category.name}</span>
    </>
  );
}

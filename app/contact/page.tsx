import ContactForm from "@/app/_component/ContactForm";
import styles from "./page.module.css";

export default function Page() {
  return (
    <div className={styles.container}>
      <ContactForm />
    </div>
  );
}

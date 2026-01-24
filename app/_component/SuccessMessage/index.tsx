import styles from "./index.module.css";

type Props = {
  onReset: () => void;
};

export function SuccessMessage({ onReset }: Props) {
  return (
    <div className={styles.successContainer}>
      <p className={styles.success}>
        送信が完了しました。お問い合わせありがとうございます。
      </p>
      <button 
        type="button"
        className={styles.buttonSecondary}
        onClick={onReset}
      >
        続けて入力する
      </button>
    </div>
  );
}

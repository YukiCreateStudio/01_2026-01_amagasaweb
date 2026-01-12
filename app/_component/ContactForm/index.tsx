"use client";

import { useState } from "react";
import styles from "./index.module.css";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ← 超重要

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const form = e.currentTarget;

    const data = {
      lastname: form.lastname.value,
      firstname: form.firstname.value,
      company: form.company.value,
      email: form.email.value,
      message: form.message.value,
    };

    console.log(data); // ← まずはここで確認

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("res:", res);

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "送信に失敗しました");

      setSuccess(true);
      form.reset(); // 送信後フォームをリセット
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.horizontal}>
        <div className={styles.item}>
          <label className={styles.label} htmlFor="lastname">
            姓
          </label>
          <input
            className={styles.textfield}
            type="text"
            id="lastname"
            name="lastname"
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label} htmlFor="firstname">
            名
          </label>
          <input
            className={styles.textfield}
            type="text"
            id="firstname"
            name="firstname"
          />
        </div>
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="company">
          会社名
        </label>
        <input
          className={styles.textfield}
          type="text"
          id="company"
          name="company"
        />
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="email">
          メールアドレス
        </label>
        <input
          className={styles.textfield}
          type="email"
          id="email"
          name="email"
        />
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="message">
          メッセージ
        </label>
        <textarea className={styles.textarea} id="message" name="message" />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "送信中" : "送信する"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>送信が完了しました。</p>}
    </form>
  );
}

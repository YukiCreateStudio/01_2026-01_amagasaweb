"use client";

import { useState } from "react";
import styles from "./index.module.css";

type FieldErrors = {
  lastname?: string;
  firstname?: string;
  email?: string;
  message?: string;
};

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ← 超重要

    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      lastname: String(formData.get("lastname") ?? ""),
      firstname: String(formData.get("firstname") ?? ""),
      company: String(formData.get("company") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""), // honeypot
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
      if (!res.ok) {
        // ZodError対応
        if (Array.isArray(result?.errors)) {
          const fe: FieldErrors = {};
          result.errors.forEach((err: any) => {
            const field = err.path?.[0];
            if (field) fe[field as keyof FieldErrors] = err.message;
          });
          setFieldErrors(fe);
          return;
        }
        setError(result.error || "送信に失敗しました");
        return;
      }

      setSuccess(true);
      setFieldErrors({});
      form.reset(); // 送信後フォームをリセット
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Honeypot（人には見えない） */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        style={{ display: "none" }}
      />
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
            required
            maxLength={10}
          />
          {fieldErrors.lastname && (
            <p className={styles.error}>{fieldErrors.lastname}</p>
          )}
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
            required
            maxLength={10}
          />
          {fieldErrors.firstname && (
            <p className={styles.error}>{fieldErrors.firstname}</p>
          )}
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
          maxLength={40}
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
          required
          maxLength={254}
        />
        {fieldErrors.email && (
          <p className={styles.error}>{fieldErrors.email}</p>
        )}
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="message">
          メッセージ
        </label>
        <textarea
          className={styles.textarea}
          id="message"
          name="message"
          required
          maxLength={1000}
        />
        {fieldErrors.message && (
          <p className={styles.error}>{fieldErrors.message}</p>
        )}
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

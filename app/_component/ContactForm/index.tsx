"use client";

import { useState } from "react";
import styles from "./index.module.css";
import { SuccessMessage } from "../SuccessMessage";
import { contactSchema } from "@/schemas/schema";

type FieldErrors = {
  lastname?: string;
  firstname?: string;
  email?: string;
  message?: string;
};
const FIELD_ORDER = [
  "lastname",
  "firstname",
  "company",
  "email",
  "message",
] as const;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. 重複送信ガード
    if (isSubmitting || success) return;

    //初期化処理
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    //rawデータの取得
    const rawData = {
      lastname: String(formData.get("lastname") ?? ""),
      firstname: String(formData.get("firstname") ?? ""),
      company: String(formData.get("company") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""), // honeypot
    };

    // 1. フロントエンドバリデーション (safeParseを使用)
    const result = contactSchema.safeParse(rawData);

    if (!result.success) {
      const fe: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) fe[field as keyof FieldErrors] = issue.message;
      });

      setFieldErrors(fe);

      // フォーカスとスクロールの処理
      const firstErrorField = FIELD_ORDER.find(
        (f) => fe[f as keyof FieldErrors]
      );
      if (firstErrorField) {
        const el = form.querySelector(
          `[name="${firstErrorField}"]`
        ) as HTMLElement | null;
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus();
      }
      setIsSubmitting(false);
      return; // バリデーション失敗時はここで終了
    }

    // 2. 通信処理 (try-catchで囲む)
    try {
      // バリデーション済みのクリーンなデータ (result.data) を送信
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        // API側でエラー（ZodError含む）が返った場合
        if (Array.isArray(responseData?.errors)) {
          const fe: FieldErrors = {};
          responseData.errors.forEach((err: any) => {
            const field = err.path?.[0];
            if (field) fe[field as keyof FieldErrors] = err.message;
          });
          setFieldErrors(fe);
          return;
        }
        throw new Error(responseData.error || "送信に失敗しました。");
      }

      setSuccess(true);
      form.reset();
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        "ネットワークエラーが発生しました。時間を置いて再度お試しください。"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. 成功時は完了画面を表示（二重送信の物理的防止）
  if (success) {
    return <SuccessMessage onReset={() => setSuccess(false)} />;
  }

  return (
    <>
      <div className={styles.container}>
        <p className={styles.text}>
          ご質問、ご相談は下記フォームよりお問い合わせください。
          <br />
          内容確認後、担当者より通常3営業日以内にご連絡いたします。
        </p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
              // アクセシビリティ対応
              aria-invalid={!!fieldErrors.lastname}
              aria-describedby={
                fieldErrors.lastname ? "lastname-error" : undefined
              }
            />
            {fieldErrors.lastname && (
              <p className={styles.error} id="lastname-error">
                {fieldErrors.lastname}
              </p>
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
              // アクセシビリティ対応
              aria-invalid={!!fieldErrors.firstname}
              aria-describedby={
                fieldErrors.firstname ? "firstname-error" : undefined
              }
            />
            {fieldErrors.firstname && (
              <p className={styles.error} id="firstname-error">
                {fieldErrors.firstname}
              </p>
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
            // アクセシビリティ対応
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
          />
          {fieldErrors.email && (
            <p className={styles.error} id="email-error">
              {fieldErrors.email}
            </p>
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
            // アクセシビリティ対応
            aria-invalid={!!fieldErrors.message}
            aria-describedby={fieldErrors.message ? "message-error" : undefined}
          />
          {fieldErrors.message && (
            <p className={styles.error} id="message-error">
              {fieldErrors.message}
            </p>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? "送信中..." : "送信する"}
          </button>
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </form>
    </>
  );
}

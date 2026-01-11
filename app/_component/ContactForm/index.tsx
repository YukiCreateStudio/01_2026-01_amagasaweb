"use client";

import { useState } from "react";
import styles from "./index.module.css";
import { z } from "zod";

//バリデーションの定義
const schema = z.object({
  lastname: z.string().min(2, { message: "姓は2文字以上で入力してください" }),
  firstname: z.string().min(2, { message: "名は2文字以上で入力してください" }),
  company: z
    .string()
    .min(2, { message: "会社名は2文字以上で入力してください" }),
  email: z.email({ message: "正しいメールアドレスを入力してください" }),
  message: z.string().min(10, { message: "10文字以上入力してください" }),
});

export default function ContactForm() {
  const [form, setForm] = useState({
    lastname: "",
    firstname: "",
    company: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    lastname?: string;
    firstname?: string;
    company?: string;
    email?: string;
    message?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: {
        lastname?: string;
        firstname?: string;
        company?: string;
        email?: string;
        message?: string;
      } = {};

      result.error.issues.forEach(({ path, message }) => {
        if (path[0] === "lastname") fieldErrors.lastname = message;
        if (path[0] === "firstname") fieldErrors.firstname = message;
        if (path[0] === "company") fieldErrors.company = message;
        if (path[0] === "email") fieldErrors.email = message;
        if (path[0] === "message") fieldErrors.message = message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.status === "success") {
        console.log(data.message, "saccess");
        setForm({
          lastname: "",
          firstname: "",
          company: "",
          email: "",
          message: "",
        });
      } else {
        console.log(data.message || "送信に失敗しました", "error");
      }
    } catch (err) {
      console.log("エラーが発生しました。もう一度お試しください。", "error");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
            value={form.lastname}
            onChange={handleChange}
          />
          {errors.lastname && <p>{errors.lastname}</p>}
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
            value={form.firstname}
            onChange={handleChange}
          />
          {errors.firstname && <p>{errors.firstname}</p>}
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
          value={form.company}
          onChange={handleChange}
        />
        {errors.company && <p>{errors.company}</p>}
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
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p>{errors.email}</p>}
      </div>
      <div className={styles.item}>
        <label className={styles.label} htmlFor="message">
          メッセージ
        </label>
        <textarea
          className={styles.textarea}
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
        />
        {errors.message && <p>{errors.message}</p>}
      </div>
      <div className={styles.actions}>
        <button type="submit" className={styles.button}>
          送信する
        </button>
      </div>
    </form>
  );
}

import { z } from "zod";

// 禁止ワードのリスト
const BANNED_WORDS = ["カジノ", "暗号資産", "精力剤", "死ね", "殺す"];

/**
 * テキストにNGワードが含まれているか判定する関数
 */
const containsBannedWords = (text: string) =>
  BANNED_WORDS.some((word) => text.includes(word));

export const contactSchema = z.object({
  website: z.string().optional(),
  lastname: z.string().trim().min(1, "姓を入力してください").max(10),
  firstname: z.string().trim().min(1, "名を入力してください").max(10),
  company: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  //optional()は空文字を除外しないため、trim()しても""がそのまま通る。未入力と空欄が区別されデータが汚れるため、空文字をundefinedに変換する設計が実務向き。
  email: z.email("正しいメールアドレスを入力してください").trim().max(254),
  message: z
    .string()
    .trim()
    .min(1, "メッセージを入力してください")
    .max(1000, "メッセージは1000文字以内で入力してください")
    // NGワードチェック
    .refine((val) => !containsBannedWords(val), {
      message: "メッセージに不適切な表現が含まれています。",
    })
    // URLチェック
    .refine((val) => !/https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+/.test(val), {
      message: "URLの入力は禁止されています。",
    }),
});

// TypeScriptの型としてもエクスポート
export type ContactInput = z.infer<typeof contactSchema>;

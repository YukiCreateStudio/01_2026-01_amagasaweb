import { z } from "zod";

export const contactSchema = z.object({
  website: z.string().optional(),
  lastname: z.string().trim().min(1, "姓を入力してください").max(50),
  firstname: z.string().trim().min(1, "名を入力してください").max(50),
  company: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
    //optional()は空文字を除外しないため、trim()しても""がそのまま通る。未入力と空欄が区別されデータが汚れるため、空文字をundefinedに変換する設計が実務向き。
  email: z.email("正しいメールアドレスを入力してください").trim().max(254),
  message: z
    .string()
    .trim()
    .min(1, "メッセージを入力してください")
    .max(1000, "メッセージは1000文字以内で入力してください"),
});

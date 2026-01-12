import { z } from "zod";

export const contactSchema = z.object({
  website: z.string().optional(),
  lastname: z.string().min(1, "姓を入力してください"),
  firstname: z.string().min(1, "名を入力してください"),
  company: z.string().optional(),
  email: z.email("正しいメールアドレスを入力してください"),
  message: z.string().min(1, "メッセージを入力してください"),
});

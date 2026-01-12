//ここはブラウザではなくサーバで実行されるAPIルート(サーバーサイドで動くAPIエンドポイント)
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/schemas/schema";

// Resendのインスタンス（APIキーは環境変数から取得）
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    // Zodで入力チェック
    const data = contactSchema.parse(json);

    // Resendでメール送信
    await resend.emails.send({
      from: "テストサイト <onboarding@resend.dev>",
      to: "自分 <delivered@resend.dev>",
      subject: `${data.lastname}様から、お問い合わせがありました`,
      text: `
        氏　名: ${data.lastname}${data.firstname}様
        会社名: ${data.company ?? "-"}
        メール: ${data.email}
        内　容:
        　${data.message}
      `,
    });

    return NextResponse.json({ message: "送信完了しました" });
  } catch (err: any) {
    console.error(err);

    // Zodエラーかどうかで分ける
    if (err.name === "ZodError") {
      return NextResponse.json(
        { error: err.errors.map((e: any) => e.message).join("\n") },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}

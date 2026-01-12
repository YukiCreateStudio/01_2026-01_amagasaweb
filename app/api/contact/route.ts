//ここはブラウザではなくサーバで実行されるAPIルート(サーバーサイドで動くAPIエンドポイント)

// ① Edge Runtimeで動くAPIルート
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/schemas/schema";

// Resendのインスタンス（APIキーは環境変数から取得）
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {

  try {
    const json = await req.json();

     //Honeypot
    if (json.website) {
      // botが入力したと判断
      return NextResponse.json({ error: "不正な送信です" }, { status: 400 });
    }

    // Zodでバリデーション（入力チェック）
    const data = contactSchema.parse(json);

    // Resendでメール送信(管理者宛メール)
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

    // ② 自動返信メール（ユーザー宛）
    await resend.emails.send({
      from: "テストサイト <onboarding@resend.dev>",
      to: data.email, // ★ ユーザーのメールアドレス
      subject: "【自動返信】お問い合わせありがとうございます",
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>${data.lastname} ${data.firstname} 様</h2>
          <p>お問い合わせありがとうございます。</p>
          <p>以下の内容で承りました：</p>
          <ul>
            <li>会社名: ${data.company ?? "-"}</li>
            <li>メール: ${data.email}</li>
            <li>メッセージ: ${data.message}</li>
          </ul>
          <p>担当者より追ってご連絡いたします。</p>
          <p>— テストサイト ー</p>
        </div>
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

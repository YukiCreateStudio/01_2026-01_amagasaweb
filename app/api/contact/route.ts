// ここはブラウザではなくサーバで実行されるAPIルート
// Edge Runtimeで動くAPIエンドポイント
// export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ZodError } from "zod";
import { contactSchema } from "@/schemas/schema";

// 環境変数チェック
if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set");
}

// Resendのインスタンス（APIキーは環境変数から取得）
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    /*
     * Honeypotチェック
     * ・文字が入力されていたらbotと判定
     * ・null / undefined / 空文字は誤判定防止のため除外
     */
    if (typeof json.website === "string" && json.website.trim() !== "") {
      return NextResponse.json({ error: "不正な送信です" }, { status: 400 });
    }

    /**
     * Zodでバリデーション
     * ・required / optional の最終判断はサーバで行う
     * ・trim / max / min などもここで保証
     */
    const data = contactSchema.parse(json);

    // Resendでメール送信(管理者宛メール)
    await resend.emails.send({
      from: `テストサイト <${process.env.FROM_EMAIL}>`,
      to: process.env.ADMIN_EMAIL!,
      replyTo: data.email,
      subject: `【重要】${data.lastname}様からのお問い合わせ`,
      html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h3>お問い合わせが届きました</h3>
        <table style="border-collapse: collapse;">
          <tr>
            <th style="text-align:left; padding:2px 8px;">氏名</th>
            <td style="padding:2px 8px;">
              ${data.lastname} ${data.firstname} 様
            </td>
          </tr>
          <tr>
            <th style="text-align:left; padding:2px 8px;">会社名</th>
            <td style="padding:2px 8px;">
              ${data.company ?? "-"}
            </td>
          </tr>
          <tr>
            <th style="text-align:left; padding:2px 8px;">メール</th>
            <td style="padding:2px 8px;">
              ${data.email}
            </td>
          </tr>
        </table>
        <h3 style="margin-top:16px;">メッセージ内容</h3>
        <pre style="
          background:#f6f6f6;
          padding:12px;
          white-space:pre-wrap;
          border-radius:4px;
        ">${data.message}</pre>
      </div>
    `,
    });

    // ② 自動返信メール（ユーザー宛）
    await resend.emails.send({
      from: `テストサイト <${process.env.NOREPLY_EMAIL}>`,
      to: data.email, // ★ ユーザーのメールアドレス
      subject: "【自動返信】お問い合わせありがとうございます",
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>${data.lastname} ${data.firstname} 様</h2>
          <p>お問い合わせありがとうございます。</p>
          <p>以下の内容で承りました：</p>
          <ul>
            <li>会社名: ${data.company ?? "-"}　様</li>
            <li>メール: ${data.email}</li>
            <li>メッセージ: ${data.message}</li>
          </ul>
          <p>担当者より追ってご連絡いたします。</p>
          <p>— テストサイト ー</p>
          <p>https://amagasa-web.jp</p>
          <p>無断転載を禁じます。</p>
          <p>------------------------------------------</p>
          <p>※本メールは送信専用のメールアドレスから送信しています。</p>
          <p>　ご返信できませんのでご了承ください。</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "送信完了しました" });
  } catch (err) {
    console.error(err);

    /**
     * Zodエラー（入力不備）
     */

    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          errors: err.issues,
        },
        { status: 400 }
      );
    }

    /**
     * それ以外（サーバ・外部APIエラー）
     */
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}

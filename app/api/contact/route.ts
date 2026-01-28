// ここはブラウザではなくサーバで実行されるAPIルート
// Edge Runtimeで動くAPIエンドポイント
export const runtime = "edge";// Cloudflare Pagesには必須

import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { contactSchema } from "@/schemas/schema";

// 環境変数チェック
if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set");
}

// Resendのインスタンス（APIキーは環境変数から取得）

export async function POST(req: NextRequest) {

  try {
    const json = await req.json();

    /*
     * Honeypotチェック(スパム対策)
     * ・文字が入力されていたらbotと判定
     * ・null / undefined / 空文字は誤判定防止のため除外
     */
    if (typeof json.website === "string" && json.website.trim() !== "") {
      return NextResponse.json({ error: "不正な送信です" }, { status: 400 });
    }

    //Zodでバリデーション
    const data = contactSchema.parse(json);

    // Resendでメール送信(管理者宛メール)
    const sendEmail = async (from:string ,to: string, subject: string, html: string, replyTo?: string) => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from:from,
          to: [to],
          subject: subject,
          html: html,
          reply_to: replyTo, // SDKと違い、ここがスネークケース(reply_to)になります
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Resend API Error:", errorData);
        throw new Error("メール送信に失敗しました");
      }
    };

    // ① 管理者宛メール
    await sendEmail(
      `テストサイト <${process.env.FROM_EMAIL}>`,
      process.env.ADMIN_EMAIL!,
      `【重要】${data.lastname}様からのお問い合わせ`,
      `<div style="font-family: sans-serif; line-height: 1.6;">
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
      </div>`,
      data.email // replyTo:返信先をお客様のアドレスに設定
    );

    // ② お客様への自動返信（ユーザー宛）
    await sendEmail(
      `テストサイト <${process.env.NOREPLY_EMAIL}>`,
      data.email,// ★ ユーザーのメールアドレス
      "【自動返信】お問い合わせありがとうございます",
      `<div style="font-family: sans-serif; line-height: 1.5;">
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
        <p>ご返信できませんのでご了承ください。</p>
      </div>`
    );

    return NextResponse.json({ message: "送信完了しました" });
  } catch (err) {
    console.error(err);

    /* Zodエラー（入力不備）*/
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          errors: err.issues,
        },
        { status: 400 }
      );
    }

    /* それ以外（サーバ・外部APIエラー）*/
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}

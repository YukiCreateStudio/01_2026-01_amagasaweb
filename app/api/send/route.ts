// import { Resend } from "resend";
// import { buildAdminMessage,buildUserMessage } from "@/app/_component/emailTemplate";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(req: Request) {

//   const { lastname, firstname, company, email, message } = await req.json();

//   if (!lastname || !firstname || !company || !email || !message) {
//     return Response.json(
//       { status: "error", message: "すべての項目を入力してください" },
//       { status: 400 }
//     );
//   }

//   try {
//     // 管理者向け通知
//     await resend.emails.send({
//       from: `お問い合わせフォーム <${process.env.FROM_EMAIL}>`,
//       to: process.env.CONTACT_TO!,
//       subject: `【新着】お問い合わせが届きました：${lastname}様`,
//       text: buildAdminMessage(lastname, firstname, company, email, message),
//     });

//     // ユーザー向け自動返信
//     await resend.emails.send({
//       from: `サポートチーム <${process.env.FROM_EMAIL}>`,
//       to: email,
//       subject: `【自動返信】お問い合わせありがとうございました：${lastname}様`,
//       text: buildUserMessage(lastname, firstname, company, email, message),
//     });

//     return Response.json(
//       { status: "success", message: "お問い合わせを送信しました" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return Response.json(
//       { status: "error", message: "メール送信に失敗しました" },
//       { status: 500 }
//     );
//   }
// }

export const runtime = "edge";
import { EmailTemplate } from "@/app/_component/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { lastname, firstname, company, email, message } = await req.json();
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "お問い合わせがありました",
      react: EmailTemplate({ lastname, firstname, company, email, message }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

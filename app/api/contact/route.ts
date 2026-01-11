export const runtime = 'edge';

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function buildAdminMessage(
  lastname: string,
  firstname: string,
  company: string,
  email: string,
  message: string
) {
  return `新しいお問い合わせがありました：
    【お名前】${lastname}${firstname}
    【会社名】${company}
    【アドレス】${email}
    【メッセージ】
    ${message}
  `;
}

function buildUserMessage(
  lastname: string,
  firstname: string,
  company: string,
  email: string,
  message: string
) {
  return `${lastname}様
    この度はお問い合わせいただき、誠にありがとうございました。
    以下の内容で受け付けいたしました。

    -----------------------------------
    【お名前】${lastname}${firstname}
    【会社名】${company}
    【アドレス】${email}
    【メッセージ】
    ${message}
    -----------------------------------

    内容をご確認の上、担当者よりご連絡いたしますので、今しばらくお待ちください。
  `;
}

export async function POST(req: Request) {
  const { lastname, firstname, company, email, message } = await req.json();

  if (!lastname || !firstname || !company || !email || !message) {
    return NextResponse.json(
      {
        status: "error",
        message: "すべての項目を入力してください",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    //管理者に通知
    await transporter.sendMail({
      from: `"お問い合わせフォーム"<${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO,
      subject: `【新着】お問い合わせが届きました：${lastname}様`,
      text: buildAdminMessage(lastname, firstname, company, email, message),
    });

    //お客様に自動返信
    await transporter.sendMail({
      from: `"サポートチーム"<${process.env.SMTP_USER}>`,
      to: email,
      subject: `【自動返信】お問い合わせありがとうございました：${lastname}様`,
      text: buildUserMessage(lastname, firstname, company, email, message),
    });

    return NextResponse.json(
      {
        status: "success",
        message: "お問い合わせを送信しました",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        message: "メール送信に失敗しました",
      },
      {
        status: 500,
      }
    );
  }
}

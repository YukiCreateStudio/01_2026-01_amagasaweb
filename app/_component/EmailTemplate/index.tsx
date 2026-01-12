// export function buildAdminMessage(
//   lastname: string,
//   firstname: string,
//   company: string,
//   email: string,
//   message: string
// ) {
//   return `
// 新しいお問い合わせがありました：

// -----------------------------------
// 【お名前】${lastname} ${firstname}
// 【会社名】${company}
// 【アドレス】${email}

// 【メッセージ】
// ${message}
// -----------------------------------

// `;
// }

// export function buildUserMessage(
//   lastname: string,
//   firstname: string,
//   company: string,
//   email: string,
//   message: string
// ) {
//   return `
// ${lastname}様

// この度はお問い合わせいただき、誠にありがとうございました。
// 以下の内容で受け付けいたしました。

// -----------------------------------
// 【お名前】${lastname} ${firstname}
// 【会社名】${company}
// 【アドレス】${email}

// 【メッセージ】
// ${message}
// -----------------------------------

// 内容を確認のうえ、担当者よりご連絡いたします。
// 今しばらくお待ちください。
// `;
// }

interface EmailTemplateProps {
  lastname: string;
  firstname: string;
  company: string;
  email: string;
  message: string;
}

export function EmailTemplate({
  lastname,
  firstname,
  company,
  email,
  message
}: EmailTemplateProps) {
  return (
    <div>
      <h2>お問い合わせ内容</h2>
      <p>
        お名前：{lastname}
        {firstname}様
      </p>
      <p>会社名：{company}</p>
      <p>メール：{email}</p>
      <p>内容：</p>
      <p>{message}</p>
    </div>
  );
}

import nodemailer from "nodemailer";
import { site, study } from "@/config/study";

/**
 * 신규 신청 알림 메일.
 *
 * SMTP 값이 없으면 조용히 건너뛴다 — 알림이 안 된다고 신청이 막혀서는
 * 안 된다. 신청은 이미 저장된 뒤에 부르는 것이라, 여기서 실패해도
 * 신청자에게는 아무 일도 일어나지 않아야 한다.
 */
export async function notifyNewApplicant(v: {
  name: string;
  company: string | null;
  industry: string;
  phone: string;
  email: string | null;
  route: string | null;
  message: string | null;
}) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.NOTIFY_TO || site.contact.email;
  if (!user || !pass || !to) return;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const lines = [
    `이름   ${v.name}`,
    `연락처 ${v.phone}`,
    `전문분야 ${v.industry}`,
    v.company ? `회사   ${v.company}` : null,
    v.email ? `이메일 ${v.email}` : null,
    v.route ? `알게 된 경로 ${v.route}` : null,
    v.message ? `문의   ${v.message}` : null,
  ].filter(Boolean);

  await transport.sendMail({
    from: user,
    to,
    subject: `[${study.title} ${study.cohort}] 사전 신청 — ${v.name}`,
    text: lines.join("\n"),
  });
}

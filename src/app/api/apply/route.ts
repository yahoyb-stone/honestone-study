import { NextResponse, after } from "next/server";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";
import { notifyNewApplicant } from "@/lib/notify";
import { site, studyAssignLabel } from "@/config/study";

export const runtime = "nodejs";

/**
 * 스터디 사전 신청 접수.
 *
 * 어니스톤이 이미 쓰고 있는 Supabase 의 `submit_visitor_request` 로 저장한다.
 * 신청 명단을 한 곳에서 보기 위해서다 — 여기서 접수한 분도 기존 관리자
 * 화면의 명단·문자 도구에 그대로 나타난다. 분류는 chapter 칸에 들어가는
 * studyAssignLabel 로 갈린다.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 });
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");

  const name = str("name");
  const phone = str("phone");
  const industry = str("industry");
  const email = str("email");

  if (!name) return NextResponse.json({ error: "성함을 입력해 주세요." }, { status: 400 });
  if (!phone) return NextResponse.json({ error: "휴대폰 번호를 입력해 주세요." }, { status: 400 });
  if (!industry) return NextResponse.json({ error: "하시는 일을 입력해 주세요." }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "올바른 이메일을 입력해 주세요." }, { status: 400 });
  if (!body.agree_privacy)
    return NextResponse.json({ error: "개인정보 수집 동의가 필요합니다." }, { status: 400 });

  if (!hasSupabaseEnv()) {
    console.error("[apply] Supabase env missing — submission dropped:", name, phone);
    return NextResponse.json(
      { error: "서버 설정 오류입니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }

  const route = str("referred_by_name");

  const res = await supabaseRest("rpc/submit_visitor_request", {
    method: "POST",
    body: JSON.stringify({
      payload: {
        name,
        company: str("company") || null,
        industry,
        phone,
        email: email || null,
        chapter: studyAssignLabel,
        referred_by_name: route || null,
        message: str("message") || null,
        consented_at: new Date().toISOString(),
        source: str("source") || "study",
        utm_source: str("utm_source") || null,
        utm_medium: str("utm_medium") || null,
        utm_campaign: str("utm_campaign") || null,
        utm_content: str("utm_content") || null,
        landing_path: str("landing_path") || null,
        referrer: str("referrer") || null,
        is_bni_member: false,
        member_chapter: null,
        visit_date: null,
      },
    }),
  });

  if (!res.ok) {
    // 응답 본문에는 입력값이 섞여 나올 수 있으므로 기록은 상태 코드만 남긴다.
    // 다만 '한 번호로 너무 많이' 는 신청자가 스스로 고칠 수 있는 상황이라
    // 이유를 알려 준다 — 알 수 없는 오류로 보이면 계속 다시 누르게 된다.
    const detail = await res.text().catch(() => "");
    console.error("[apply] insert error", res.status);
    if (detail.includes("too many submissions")) {
      return NextResponse.json(
        {
          error: `같은 번호로 신청이 여러 건 들어왔습니다. 이미 접수되었을 수 있으니 ${site.contact.name} ${site.contact.phone} 로 확인 부탁드립니다.`,
        },
        { status: 429 },
      );
    }
    return NextResponse.json({ error: "신청 저장 중 오류가 발생했습니다." }, { status: 500 });
  }

  // 알림은 응답을 막지 않는다. 저장이 끝난 시점에 접수는 이미 성립했고,
  // 알림 실패가 신청자를 기다리게 하거나 오류 화면을 띄워서는 안 된다.
  after(async () => {
    await notifyNewApplicant({
      name,
      company: str("company") || null,
      industry,
      phone,
      email: email || null,
      route: route || null,
      message: str("message") || null,
    }).catch((e) => console.error("[apply] notify error", e));
  });

  return NextResponse.json({ ok: true });
}

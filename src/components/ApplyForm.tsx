"use client";

import { useState } from "react";
import { site, study } from "@/config/study";

/**
 * 어디를 보고 들어왔는지. 보낼 때 한 번만 읽는다 — 화면에 그릴 값이 아니라
 * 같이 부칠 값이라, 상태로 들고 있을 이유가 없다.
 */
function trackingFields(): Record<string, string> {
  const q = new URLSearchParams(window.location.search);
  const t: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
    const v = q.get(k);
    if (v) t[k] = v;
  }
  // 페이스북/인스타 광고는 fbclid만 붙는 경우가 있어 보조 지표로 함께 남긴다.
  if (!t.utm_source && q.get("fbclid")) t.utm_source = "meta";
  t.landing_path = window.location.pathname + window.location.search;
  if (document.referrer) t.referrer = document.referrer;
  return t;
}

/**
 * 사전 신청 폼.
 *
 * 묻는 것을 적게 둔다 — 아직 일정도 회비도 없는 자리라, 여기서 회사
 * 이력을 캐물으면 남길 사람도 남기지 않는다. 성함·연락처·하시는 일이면
 * 연락해서 나머지를 여쭐 수 있다.
 */
export default function ApplyForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    if (!fd.get("agree_privacy")) {
      setError("개인정보 수집·이용에 동의해 주세요.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(fd.entries()),
          ...trackingFields(),
        }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b?.error ?? "신청 중 오류가 발생했습니다.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "신청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center text-neutral-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-3xl">
          ✓
        </div>
        <h3 className="mt-4 text-2xl font-bold">사전 신청이 접수되었습니다.</h3>
        <p className="mt-4 break-keep leading-relaxed text-neutral-600">
          일정과 회비가 확정되는 대로 신청 순서대로 문자로 안내드립니다. 궁금한
          점은 편하게 연락 주세요 —{" "}
          <a
            href={`tel:${site.contact.phone}`}
            className="font-bold text-amber-700"
          >
            {site.contact.name} {site.contact.phone}
          </a>
        </p>
        <a
          href={site.contact.kakaoChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FEE500] px-7 py-4 text-lg font-bold text-[#3C1E1E] shadow-md transition-transform hover:scale-105"
        >
          💬 카카오 오픈채팅 참여하기 →
        </a>
      </div>
    );
  }

  const inputClass =
    "h-12 w-full rounded-lg border border-neutral-300 bg-white px-3.5 text-base text-neutral-900 outline-none transition focus:border-amber-500";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl bg-white p-6 text-left sm:p-10"
    >
      <input type="hidden" name="source" value={`study-${study.cohort}`} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="성함" required>
          <input name="name" required autoComplete="name" className={inputClass} />
        </Field>
        <Field label="휴대폰" required>
          <input
            name="phone"
            required
            type="tel"
            autoComplete="tel"
            placeholder="010-0000-0000"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="하시는 일" required>
        <input
          name="industry"
          required
          placeholder="예: 제조업, 세무사, 인테리어, IT 솔루션 등"
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="회사명">
          <input name="company" autoComplete="organization" className={inputClass} />
        </Field>
        <Field label="이메일">
          <input
            name="email"
            type="email"
            autoComplete="email"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="알게 된 경로">
          <input
            name="referred_by_name"
            placeholder="소개해 주신 분 성함 또는 ‘광고’, ‘검색’"
            className={inputClass}
          />
        </Field>
        <Field label="궁금한 점">
          <input name="message" className={inputClass} />
        </Field>
      </div>

      <label className="flex items-start gap-2 text-sm text-neutral-500">
        <input type="checkbox" name="agree_privacy" required className="mt-1" />
        <span>
          <span className="text-amber-600">*</span> 신청 처리와 안내를 위한
          개인정보(성함·연락처·하시는 일 등)의 수집·이용에 동의합니다. 안내가
          완료된 날부터 6개월간 보관 후 파기하며, 자세한 내용은{" "}
          <a
            href="/privacy"
            target="_blank"
            className="font-semibold text-amber-700 hover:underline"
          >
            개인정보 처리방침
          </a>
          에서 확인하실 수 있습니다.
        </span>
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-neutral-950 py-4 text-base font-bold text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
      >
        {loading ? "신청 중…" : "사전 신청하기"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 inline-block text-[13px] font-semibold text-neutral-500">
        {label}
        {required && <span className="text-amber-600"> *</span>}
      </span>
      {children}
    </label>
  );
}

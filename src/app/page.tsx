import Image from "next/image";
import Link from "next/link";
import ApplyForm from "@/components/ApplyForm";
import { site, siteUrl, study } from "@/config/study";

/** 검색엔진·AI 답변용 구조화 데이터 — 과정 소개와 FAQ. */
function StudyJsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: study.title,
      description: study.intro,
      provider: { "@type": "Organization", name: site.name, url: siteUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: study.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** 상단바 — 항상 붙어 있어 어디서든 신청으로 갈 수 있다. */
function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="text-lg font-extrabold tracking-tight text-neutral-900">
            {site.brand}
          </span>
          <span className="text-lg font-extrabold text-amber-600">스터디</span>
        </Link>
        <a
          href="#apply"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
        >
          {study.cohort} 사전 신청
        </a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-4xl px-5 py-12">
        <p className="text-lg font-extrabold text-neutral-900">
          {site.brand} <span className="text-amber-600">스터디</span>
        </p>
        <p className="mt-1 text-sm text-neutral-500">{site.tagline}</p>

        <div className="mt-6 space-y-2 text-sm text-neutral-600">
          <p className="font-semibold text-neutral-900">
            {site.contact.name}
            <span className="ml-1.5 font-normal text-neutral-400">
              {site.contact.role}
            </span>
          </p>
          <p>
            전화{" "}
            <a href={`tel:${site.contact.phone}`} className="hover:text-amber-600">
              {site.contact.phone}
            </a>
            {" · "}이메일{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="hover:text-amber-600"
            >
              {site.contact.email}
            </a>
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={site.contact.kakaoChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FEE500] px-4 py-2 text-sm font-bold text-[#3C1E1E] transition-transform hover:scale-105"
            >
              💬 카카오 오픈채팅
            </a>
            {site.contact.littlyUrl && (
              <a
                href={site.contact.littlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:border-amber-600 hover:text-amber-600"
              >
                👤 어니스톤 {site.contact.name}
              </a>
            )}
            {site.contact.youtubeUrl && (
              <a
                href={site.contact.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FF0000] px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
              >
                ▶ 유튜브 ‘사업은 처음이라’
              </a>
            )}
          </div>
        </div>

        <p className="mt-10 text-xs text-neutral-400">
          © {new Date().getFullYear()} {site.name}. ·{" "}
          <a href="/privacy" className="underline hover:text-amber-600">
            개인정보 처리방침
          </a>
        </p>
      </div>
    </footer>
  );
}

export default function StudyPage() {
  return (
    <>
      <StudyJsonLd />
      <TopBar />

      <main className="flex-1">
        {/* 히어로 */}
        <section className="bg-neutral-950 py-20 text-white">
          <div className="mx-auto max-w-4xl px-5">
            <p className="inline-block rounded-full bg-amber-400/15 px-4 py-1.5 text-sm font-bold text-amber-300">
              {study.eyebrow} · {study.cohort} 모집
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {study.title}
            </h1>
            <p className="mt-4 text-2xl font-bold text-amber-300">
              {study.subtitle}
            </p>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/75">
              {study.intro}
            </p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-5">
                <dt className="text-sm text-white/60">과정</dt>
                <dd className="mt-1 text-lg font-bold">
                  전 {study.sessionCount}회 · {study.capacity}
                </dd>
                <dd className="text-sm text-white/70">{study.place}</dd>
              </div>
              <div className="rounded-2xl bg-white/10 p-5">
                <dt className="text-sm text-white/60">일정</dt>
                <dd className="mt-1 text-sm leading-relaxed text-white/85">
                  {study.schedule}
                </dd>
              </div>
              <div className="rounded-2xl bg-white/10 p-5">
                <dt className="text-sm text-white/60">회비</dt>
                <dd className="mt-1 text-lg font-bold">{study.fee}</dd>
                <dd className="text-sm text-white/70">확정 시 개별 안내</dd>
              </div>
            </dl>

            <a
              href="#apply"
              className="mt-8 inline-block rounded-full bg-amber-400 px-8 py-4 text-lg font-bold text-neutral-950 transition-transform hover:scale-[1.03]"
            >
              {study.cohort} 사전 신청하기 →
            </a>
            <p className="mt-3 text-sm text-white/50">
              사전 신청은 참여 확정이 아닙니다. 일정이 나오면 신청 순서대로 먼저
              안내드립니다.
            </p>
          </div>
        </section>

        {/* 왜 인증인가 */}
        <section className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="text-3xl font-extrabold tracking-tight">
            인증이 돈이 되는 구조
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-neutral-700">
            인증은 액자에 걸어두는 종이가 아니라, 정책자금·입찰·세제로 이어지는
            문입니다. 그 문이 어디에 있는지 알면 회사의 다음 수가 달라집니다.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {study.whyCards.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-neutral-200 p-6"
              >
                <h3 className="font-bold text-neutral-900">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            제도는 해마다 바뀝니다. 스터디에서는 그 시점의 공고와 요강을 직접
            열어 확인하는 법까지 함께 다룹니다.
          </p>
        </section>

        {/* 커리큘럼 */}
        <section className="bg-neutral-950 py-16 text-white">
          <div className="mx-auto max-w-4xl px-5">
            <h2 className="text-3xl font-extrabold tracking-tight">
              전 {study.sessionCount}회, 이렇게 공부합니다
            </h2>
            <p className="mt-3 text-white/70">
              커리큘럼은 {study.cohort} 멤버의 업종과 상황에 맞춰 조정될 수
              있습니다.
            </p>

            <ol className="mt-10">
              {study.curriculum.map((c, i) => (
                <li key={c.no} className="flex gap-4 sm:gap-6">
                  <div className="flex flex-col items-center">
                    <span className="mt-1 flex h-3 w-3 shrink-0 rounded-full bg-amber-400" />
                    {i < study.curriculum.length - 1 && (
                      <span className="w-px flex-1 bg-white/20" />
                    )}
                  </div>
                  <div className={i < study.curriculum.length - 1 ? "pb-8" : ""}>
                    <p className="text-sm font-bold text-amber-300">
                      {c.no}회차
                    </p>
                    <h3 className="mt-0.5 text-lg font-bold">{c.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">
                      {c.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 이런 분께 · 진행 방식 */}
        <section className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="text-3xl font-extrabold tracking-tight">
            이런 분께 권합니다
          </h2>
          <ul className="mt-8 space-y-3">
            {study.audience.map((a) => (
              <li
                key={a}
                className="flex gap-3 rounded-2xl border border-neutral-200 p-5"
              >
                <span className="text-amber-600">✓</span>
                <span className="text-neutral-700">{a}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl bg-neutral-50 p-6">
            <p className="font-bold text-neutral-900">진행 방식</p>
            <ul className="mt-3 space-y-1.5 text-sm text-neutral-600">
              {study.format.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 이끄는 사람 */}
        <section className="bg-neutral-50 py-16">
          <div className="mx-auto flex max-w-4xl flex-col gap-8 px-5 sm:flex-row sm:items-center">
            <div className="mx-auto w-56 shrink-0 overflow-hidden rounded-full bg-gradient-to-b from-white to-amber-100 sm:mx-0 sm:w-64">
              <Image
                src={study.leader.photo}
                alt={`${study.leader.name} — ${study.leader.title}`}
                width={593}
                height={720}
                sizes="(max-width: 640px) 224px, 256px"
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-600">
                스터디를 이끄는 사람
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">
                {study.leader.name} · {study.leader.title}
              </h2>
              <p className="mt-3 leading-relaxed text-neutral-600">
                {study.leader.bio}
              </p>
              <p className="mt-3 text-sm text-neutral-500">
                궁금한 점은 전화 주셔도 됩니다 —{" "}
                <a
                  href={`tel:${site.contact.phone}`}
                  className="font-bold text-amber-700"
                >
                  {site.contact.phone}
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문 */}
        <section className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="text-3xl font-extrabold tracking-tight">
            자주 묻는 질문
          </h2>
          <div className="mt-8 space-y-3">
            {study.faqs.map((f) => (
              <details
                key={f.q}
                className="rounded-2xl border border-neutral-200 p-5 open:bg-neutral-50"
              >
                <summary className="cursor-pointer list-none font-bold text-neutral-900 [&::-webkit-details-marker]:hidden">
                  <span className="mr-2 text-amber-600">Q.</span>
                  {f.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 신청 */}
        <section
          id="apply"
          className="scroll-mt-20 bg-neutral-950 py-20 text-white"
        >
          <div className="mx-auto max-w-3xl px-5 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {study.title} {study.cohort} 사전 신청
            </h2>
            <p className="mt-4 text-white/70">
              전 {study.sessionCount}회 · {study.capacity} · {study.place}
              <br />
              일정과 회비는 {study.cohort} 신청자가 모이면 확정해 개별
              안내드립니다.
            </p>
            <p className="mt-2 text-sm text-white/50">
              성함·연락처·하시는 일만 적으시면 됩니다. 사전 신청은 참여 확정이
              아니니 부담 없이 남겨 주세요.
            </p>
            <div className="mt-10">
              <ApplyForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

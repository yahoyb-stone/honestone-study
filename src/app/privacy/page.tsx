import type { Metadata } from "next";
import Link from "next/link";
import { site, study } from "@/config/study";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: `개인정보 처리방침 | ${site.name}`,
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-5 py-16">
      <Link
        href="/"
        className="text-sm font-semibold text-amber-700 hover:underline"
      >
        ← {site.name}
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
        개인정보 처리방침
      </h1>
      <p className="mt-3 text-sm text-neutral-500">
        {site.name}({site.contact.name}, 이하 “운영자”)은 {study.title} 신청자의
        개인정보를 아래와 같이 처리합니다.
      </p>

      <dl className="mt-10 space-y-8 text-neutral-700">
        <Section title="1. 수집 항목">
          성함, 휴대폰 번호, 하시는 일(업종), 회사명, 이메일, 알게 된 경로,
          문의 내용. 이 중 성함·휴대폰 번호·하시는 일만 필수이고 나머지는
          선택입니다. 접속 시 광고 유입 경로(UTM 값)와 유입 주소가 함께
          기록됩니다.
        </Section>

        <Section title="2. 이용 목적">
          스터디 사전 신청 접수와 확인, 일정·회비 확정 안내, 문의 응대에만
          씁니다. 다른 목적으로는 이용하지 않습니다.
        </Section>

        <Section title="3. 보유 기간">
          안내가 완료된 날부터 6개월간 보관한 뒤 파기합니다. 그 전이라도
          삭제를 요청하시면 지체 없이 파기합니다.
        </Section>

        <Section title="4. 제3자 제공">
          제공하지 않습니다. 다만 서비스 운영을 위해 아래에 처리를 맡깁니다.
          <ul className="mt-2 space-y-1 text-sm text-neutral-600">
            <li>· Supabase — 신청 정보 저장</li>
            <li>· Vercel — 웹사이트 호스팅</li>
          </ul>
        </Section>

        <Section title="5. 정보주체의 권리">
          열람·정정·삭제·처리정지를 언제든 요청하실 수 있습니다. 아래 연락처로
          말씀해 주시면 지체 없이 처리합니다.
        </Section>

        <Section title="6. 문의처">
          {site.contact.name} ({site.contact.role})
          <br />
          전화{" "}
          <a href={`tel:${site.contact.phone}`} className="text-amber-700">
            {site.contact.phone}
          </a>
          <br />
          이메일{" "}
          <a href={`mailto:${site.contact.email}`} className="text-amber-700">
            {site.contact.email}
          </a>
        </Section>
      </dl>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-bold text-neutral-900">{title}</dt>
      <dd className="mt-2 leading-relaxed">{children}</dd>
    </div>
  );
}

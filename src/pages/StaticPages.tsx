import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import {
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  POLICY_EFFECTIVE_DATE,
  SITE_NAME_KO,
} from '../lib/site'
import { ui } from '../lib/ui'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="text-[16px] font-bold text-ink">{title}</h2>
      <div className="mt-2 space-y-2 text-[14px] leading-relaxed text-ink/80">{children}</div>
    </section>
  )
}

function ContactLine() {
  return CONTACT_EMAIL ? (
    <>
      이메일{' '}
      <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-ink underline">
        {CONTACT_EMAIL}
      </a>
    </>
  ) : (
    <>
      인스타그램 DM{' '}
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-ink underline">
        @{INSTAGRAM_HANDLE}
      </a>
    </>
  )
}

export function AboutPage() {
  return (
    <PageLayout backTo="/" backLabel="홈">
      <h1 className={ui.pageTitle}>서비스 소개</h1>
      <p className={`${ui.pageDesc} mt-2`}>
        {SITE_NAME_KO}(Simply Test)는 귀여운 캐릭터와 함께 3분 안에 끝나는 심리·유행 테스트를 만드는
        곳이에요.
      </p>

      <Section title="이런 테스트를 만들어요">
        <p>
          직장생활, 인간관계, 연애, 자아탐구처럼 매일 겪는 상황을 질문으로 옮겨, 나도 몰랐던 성향을
          캐릭터로 보여드려요. 빼빼로데이·수능·연말처럼 시즌에 맞춘 테스트도 꾸준히 새로 올립니다.
        </p>
      </Section>

      <Section title="회원가입 없이 바로">
        <p>
          로그인이나 개인정보 입력 없이 바로 시작할 수 있어요. 결과는 이미지로 저장하거나 친구에게
          링크로 공유할 수 있어요.
        </p>
      </Section>

      <Section title="참고해 주세요">
        <p>
          테스트 결과는 재미와 자기 이해를 위한 것이며, 전문적인 심리 검사나 상담을 대체하지 않아요.
        </p>
      </Section>

      <Section title="문의">
        <p>
          제휴·피드백·오류 제보는 <ContactLine />로 보내주세요.
        </p>
      </Section>

      <Link to="/tests" className={`${ui.btnPrimary} mt-8`}>
        테스트 보러 가기
      </Link>
    </PageLayout>
  )
}

/*
 * TODO(게시 전 확인): 아래 개인정보처리방침·이용약관은 현재 코드 기준(GA4, Microsoft Clarity,
 * Supabase 결과 저장, 카카오 공유)으로 작성한 초안이다. 운영자 정보·보관 기간·위탁사 국가를
 * 실제와 맞춘 뒤 게시하고, 광고(애드센스 등)를 붙이면 해당 항목을 추가한다.
 */
export function PrivacyPage() {
  return (
    <PageLayout backTo="/" backLabel="홈">
      <h1 className={ui.pageTitle}>개인정보처리방침</h1>
      <p className="mt-2 text-[13px] text-muted">시행일: {POLICY_EFFECTIVE_DATE}</p>

      <Section title="1. 수집하는 정보">
        <p>
          {SITE_NAME_KO}는 회원가입을 받지 않으며 이름·연락처 등 개인을 직접 식별하는 정보를 수집하지
          않습니다. 서비스 이용 과정에서 아래 정보가 자동으로 생성·수집될 수 있습니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>브라우저에 저장되는 익명 방문자 식별값(무작위 ID)</li>
          <li>테스트 응답 결과(결과 유형, 점수), 테스트 조회 수</li>
          <li>방문 기록, 기기·브라우저 정보, 화면 이용 기록 등 서비스 이용 통계</li>
        </ul>
      </Section>

      <Section title="2. 이용 목적">
        <ul className="list-disc space-y-1 pl-5">
          <li>테스트 결과 제공 및 결과 분포 등 통계 산출</li>
          <li>인기 테스트 집계, 서비스 품질 개선과 오류 확인</li>
        </ul>
      </Section>

      <Section title="3. 보관 기간">
        <p>
          수집한 정보는 이용 목적을 달성하면 지체 없이 파기합니다. 통계 목적으로 보관하는 익명 결과
          데이터는 최대 3년간 보관 후 삭제합니다.
        </p>
      </Section>

      <Section title="4. 외부 서비스 이용(처리 위탁)">
        <p>원활한 서비스 제공을 위해 아래 외부 서비스를 이용합니다.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Google Analytics(Google LLC): 방문 통계 분석</li>
          <li>Microsoft Clarity(Microsoft Corporation): 화면 이용 분석</li>
          <li>Supabase(Supabase Inc.): 테스트 결과·조회 수 저장</li>
          <li>Cloudflare(Cloudflare Inc.): 웹사이트 호스팅</li>
          <li>Kakao(카카오): 카카오톡 공유 기능</li>
        </ul>
        <p>
          위 서비스는 쿠키 등을 통해 정보를 수집할 수 있으며, 일부는 해외 서버에서 처리될 수 있습니다.
        </p>
      </Section>

      <Section title="5. 쿠키 거부 방법">
        <p>
          브라우저 설정에서 쿠키 저장을 거부하거나 사이트 데이터를 삭제할 수 있습니다. 이 경우에도
          테스트 이용은 가능합니다.
        </p>
      </Section>

      <Section title="6. 이용자의 권리">
        <p>
          이용자는 언제든지 개인정보 열람·정정·삭제·처리정지를 요청할 수 있습니다. 다만 수집 정보가
          익명이므로 본인 확인이 어려운 경우 처리에 제한이 있을 수 있습니다.
        </p>
      </Section>

      <Section title="7. 문의처">
        <p>
          개인정보 관련 문의는 <ContactLine />로 연락해 주세요.
        </p>
      </Section>
    </PageLayout>
  )
}

export function TermsPage() {
  return (
    <PageLayout backTo="/" backLabel="홈">
      <h1 className={ui.pageTitle}>이용약관</h1>
      <p className="mt-2 text-[13px] text-muted">시행일: {POLICY_EFFECTIVE_DATE}</p>

      <Section title="1. 목적">
        <p>
          이 약관은 {SITE_NAME_KO}(이하 “서비스”)가 제공하는 테스트 콘텐츠의 이용 조건을 정합니다.
        </p>
      </Section>

      <Section title="2. 서비스 내용">
        <p>
          서비스는 심리·유행 테스트와 결과 공유 기능을 무료로 제공합니다. 테스트 결과는 오락과 자기
          이해를 위한 참고 자료이며, 전문적인 진단이나 상담을 대체하지 않습니다.
        </p>
      </Section>

      <Section title="3. 저작권">
        <p>
          서비스의 캐릭터, 일러스트, 문항, 결과 문구 등 모든 콘텐츠의 저작권은 서비스에 있습니다. 결과
          이미지를 개인 SNS에 공유하는 것은 자유롭게 허용하며, 상업적 이용이나 무단 복제·배포는
          금지합니다.
        </p>
      </Section>

      <Section title="4. 이용자의 의무">
        <p>
          이용자는 서비스를 비정상적인 방법으로 이용하거나 운영을 방해해서는 안 됩니다.
        </p>
      </Section>

      <Section title="5. 서비스 변경 및 중단">
        <p>
          서비스는 운영상 필요에 따라 테스트를 추가·수정·종료할 수 있으며, 무료 서비스 이용과 관련해
          발생한 손해에 대해 법령이 정한 경우를 제외하고 책임을 지지 않습니다.
        </p>
      </Section>

      <Section title="6. 문의">
        <p>
          약관 관련 문의는 <ContactLine />로 연락해 주세요.
        </p>
      </Section>
    </PageLayout>
  )
}

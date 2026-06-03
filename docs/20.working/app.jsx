// ─────────────────────────────────────────────────────────────
// 미스터카샤인 · app.jsx
// 프리미엄 출장 차량 디테일링 랜딩
// ─────────────────────────────────────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "salon",
  "headlineWeight": 700,
  "showSticky": true,
  "roundness": "soft",
  "headlineFont": "serif"
} /*EDITMODE-END*/;

// ── Palettes ─────────────────────────────────────────────────
// CSS는 --c-<key> 로만 색을 참조한다.
const PALETTES = {
  salon: {
    label: "Salon",
    bg: "#0e1216", surface: "#171c22", ink: "#ece5d4", muted: "#8b8478",
    line: "#262d35", accent: "#c9a86a", accentDeep: "#a98548",
    soft: "#1f2630", sage: "#2a3640", contrast: "#0e1216",
    swatch: ["#0e1216", "#c9a86a", "#ece5d4", "#2a3640"]
  },
  dawn: {
    label: "Dawn",
    bg: "#f4f1ea", surface: "#fbf8f1", ink: "#1a2733", muted: "#6b7480",
    line: "#dccfb8", accent: "#c87a3d", accentDeep: "#a05f24",
    soft: "#ece4d2", sage: "#2c4a6b", contrast: "#fbf8f1",
    swatch: ["#f4f1ea", "#c87a3d", "#1a2733", "#2c4a6b"]
  },
  forest: {
    label: "Forest",
    bg: "#161814", surface: "#1f221d", ink: "#f1ede0", muted: "#a8a59a",
    line: "#2d3029", accent: "#c9b88a", accentDeep: "#a89866",
    soft: "#22251f", sage: "#3a4b3a", contrast: "#161814",
    swatch: ["#161814", "#c9b88a", "#f1ede0", "#3a4b3a"]
  }
};

const KEYS = ["bg", "surface", "ink", "muted", "line", "accent", "accentDeep", "soft", "sage", "contrast"];

// ── Inline SVG illustrations (props: size, c) ────────────────
const Sil = ({ size = 320, c }) =>
// Car silhouette + light streak — hero stage centerpiece
<svg width={size} height={size * 0.62} viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shine" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor={c.accent} stopOpacity="0" />
        <stop offset=".5" stopColor={c.accent} stopOpacity=".55" />
        <stop offset="1" stopColor={c.accent} stopOpacity="0" />
      </linearGradient>
    </defs>
    <ellipse cx="200" cy="215" rx="160" ry="8" fill={c.sage} opacity=".35" />
    <path d="M50 175 C 60 130, 110 95, 160 90 L 240 90 C 290 95, 330 125, 350 175 L 360 195 L 40 195 Z"
  stroke={c.sage} strokeWidth="1.5" fill={c.surface} />
    <path d="M170 95 C 180 92, 220 92, 230 95 L 245 145 L 155 145 Z" stroke={c.sage} strokeWidth="1.2" fill={c.bg} />
    <path d="M120 145 L 290 145 L 295 175 L 115 175 Z" stroke={c.sage} strokeWidth="1.2" fill={c.bg} opacity=".6" />
    <circle cx="120" cy="195" r="22" fill={c.bg} stroke={c.sage} strokeWidth="1.5" />
    <circle cx="120" cy="195" r="10" fill={c.surface} stroke={c.accentDeep} strokeWidth="1" />
    <circle cx="290" cy="195" r="22" fill={c.bg} stroke={c.sage} strokeWidth="1.5" />
    <circle cx="290" cy="195" r="10" fill={c.surface} stroke={c.accentDeep} strokeWidth="1" />
    {/* shine streak across body */}
    <path d="M70 130 C 130 160, 270 160, 340 130" stroke="url(#shine)" strokeWidth="3" strokeLinecap="round" fill="none" />
    <circle cx="338" cy="135" r="3.5" fill={c.accent} />
    <circle cx="338" cy="135" r="8" fill="none" stroke={c.accent} strokeWidth="1" opacity=".5" />
  </svg>;


const Droplet = ({ size = 24, c }) =>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3 C 7 11, 5 14, 5 17 a 7 7 0 0 0 14 0 c 0 -3, -2 -6, -7 -14 Z"
  stroke={c.accent} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M9 17 a 3 3 0 0 0 3 3" stroke={c.accent} strokeWidth="1.2" strokeLinecap="round" opacity=".6" />
  </svg>;


const Shield = ({ size = 24, c }) =>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3 L 20 6 V 12 C 20 17, 16 20, 12 21 C 8 20, 4 17, 4 12 V 6 Z"
  stroke={c.accent} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M8.5 12 L 11 14.5 L 16 9.5" stroke={c.accentDeep} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;


const Sparkle = ({ size = 24, c }) =>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3 L 13.6 10.4 L 21 12 L 13.6 13.6 L 12 21 L 10.4 13.6 L 3 12 L 10.4 10.4 Z"
  stroke={c.accent} strokeWidth="1.4" strokeLinejoin="round" fill={c.surface} />
    <circle cx="19" cy="6" r="1.5" fill={c.accentDeep} />
    <circle cx="5" cy="18" r="1.2" fill={c.accentDeep} opacity=".6" />
  </svg>;


const Tool = ({ size = 24, c }) =>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 14 L 14 5 L 19 10 L 10 19 Z" stroke={c.accent} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M4 20 L 8 16" stroke={c.accent} strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="15" cy="9" r="1.4" fill={c.accentDeep} />
  </svg>;


const Clock = ({ size = 24, c }) =>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={c.accent} strokeWidth="1.6" />
    <path d="M12 7 V 12 L 15.5 14" stroke={c.accentDeep} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;


const Chev = ({ size = 18, c }) =>
<svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path d="M3 9 H 15 M 9 3 V 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>;


// ── Sections ─────────────────────────────────────────────────

const Nav = ({ onCta }) =>
<nav className="nav">
    <div className="wrap nav__inner">
      <a href="#top" className="brand">
        <span className="brand__mark" aria-hidden="true" />
        <span>미스터카샤인</span>
      </a>
      <div className="nav__links">
        <a href="#programs">서비스</a>
        <a href="#how">진행</a>
        <a href="#reviews">후기</a>
        <a href="#faq">FAQ</a>
      </div>
      <button className="btn btn--primary btn--sm" onClick={onCta}>예약 신청하기</button>
    </div>
  </nav>;


const Hero = ({ c, onCta }) =>
<header className="wrap hero" id="top">
    <div className="hero__grid">
      <div>
        <span className="eyebrow" style={{ color: "rgb(25, 15, 4)" }}>출장 디테일링 · 서울 전 지역</span>
        <h1 className="h-display" style={{ marginTop: 18 }}>
          댁 앞에서,<br />
          90분 안에<br />
          <em style={{ color: "rgb(54, 56, 67)" }}>내 차처럼.</em>
        </h1>
        <p className="lede" style={{ marginTop: 24 }}>
          12년 경력 마스터 디테일러가 직접 방문해 시공합니다.<br />
          예약은 60초, 결제는 시공 후, 광택은 30일 보증.
        </p>
        <div className="hero__cta-row">
          <button className="btn btn--primary" onClick={onCta}>예약 신청하기</button>
          <a className="btn btn--ghost" href="#programs">서비스 둘러보기</a>
        </div>
        <div className="trust-row">
          <div><div className="trust__num">12,400+</div><div className="trust__lbl">누적 시공 차량</div></div>
          <div><div className="trust__num">4.9 / 5</div><div className="trust__lbl">실사용자 평점</div></div>
          <div><div className="trust__num">30일</div><div className="trust__lbl">광택 무상 보증</div></div>
        </div>
      </div>
      <div className="hero__card" aria-label="라이브 시공 미리보기">
        <div className="hero__chrome">
          <div className="hero__chrome-dots"><i /><i /><i /></div>
          <span>LIVE · 강남구 도산공원 인근</span>
          <span>14:22</span>
        </div>
        <div className="hero__stage">
          <Sil size={360} c={c} />
        </div>
        <div className="float-card float-card--a">
          <div className="float-card__icon"><Clock size={18} c={c} /></div>
          <div>
            <div className="float-card__t">14:22 도착</div>
            <div className="float-card__s">예상 시공 90분</div>
          </div>
        </div>
        <div className="float-card float-card--b">
          <div className="float-card__icon"><Shield size={18} c={c} /></div>
          <div>
            <div className="float-card__t">광택 30일 보증</div>
            <div className="float-card__s">결함 시 무상 재시공</div>
          </div>
        </div>
      </div>
    </div>
  </header>;


const PAIN = [
{ t: "세차장 가는 시간조차 아깝다", b: "주말 한 번이면 1~2시간. 평일은 사실상 불가능." },
{ t: "동네 세차는 매번 흠집 걱정", b: "브러시·재활용 워시미트가 도장면을 자꾸 깎아낸다." },
{ t: "비싸지만 만족도가 들쑥날쑥", b: "누가 시공했는지 모르고, 마감 품질도 매번 다르다." },
{ t: "코팅·디테일링은 너무 부담", b: "제대로 받으려면 종일 입고. 차 없는 하루가 부담스럽다." }];

const PainPoints = () =>
<section className="section section--surface" id="pain">
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">이런 분께 추천</span>
        <h2 className="h-section" style={{ marginTop: 14 }}>차는 좋은데,<br /><em>관리할 시간이 없다면.</em></h2>
      </div>
      <div className="grid grid-4">
        {PAIN.map((p, i) =>
      <article key={i} className="card">
            <span className="card__num">0{i + 1}</span>
            <h3 className="card__t">{p.t}</h3>
            <p className="card__b">{p.b}</p>
          </article>
      )}
      </div>
    </div>
  </section>;


const Differentiators = ({ c }) => {
  const items = [
  { Icon: Tool, t: "마스터 디테일러 직접 시공", b: "12년 경력의 1인 1차 책임 시공. 보조 인력 없이 처음부터 마감까지 한 사람이 끝까지 책임집니다." },
  { Icon: Droplet, t: "친환경 무세제 폼 워시", b: "PH 7.0 무세제 폼만 사용. 잔여물·환경 부담 없이 무광 도장과 PPF 위에도 안심하고 적용됩니다." },
  { Icon: Shield, t: "30일 광택 무상 보증", b: "시공 후 30일 내 도장면 결함·얼룩이 발견되면 추가 비용 없이 동일 조건으로 재시공해 드립니다." }];

  return (
    <section className="section" id="why">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">우리가 다른 이유</span>
          <h2 className="h-section" style={{ marginTop: 14 }}>세차장이 아니라,<br /><em>살롱을 부르세요.</em></h2>
          <p className="lede">손세차장 가격대로 디테일러 한 명을 통째로 부르는 셈입니다.</p>
        </div>
        <div className="grid grid-3">
          {items.map(({ Icon, t, b }, i) =>
          <article key={i} className="card diff">
              <div className="diff__icon"><Icon size={26} c={c} /></div>
              <h3 className="diff__t">{t}</h3>
              <p className="diff__b">{b}</p>
            </article>
          )}
        </div>
      </div>
    </section>);

};

const PROGRAMS = [
{ tag: "BASIC", t: "외부 손세차", b: "먼지·새똥·송진까지 잡는 기본 풀세차. 빠르게 끝내고 새 차 컨디션 회복.",
  meta: [["소요", "90분"], ["가격", "49,000"], ["방문", "전 지역"]] },
{ tag: "STANDARD", t: "실내 + 외부 풀케어", b: "운전석 가죽 컨디셔너·도어트림·헤드라이너까지 한 번에. 차량 인수 전 점검에 적합.",
  meta: [["소요", "150분"], ["가격", "89,000"], ["방문", "전 지역"]] },
{ tag: "PREMIUM", t: "프리미엄 디테일링", b: "클레이바 → 폴리시 → 광택 마감. 차령 3년 이상 차량의 도장 컨디션을 살려냅니다.",
  meta: [["소요", "4시간"], ["가격", "240,000"], ["방문", "전 지역"]] },
{ tag: "COATING", t: "세라믹 코팅 (입고)", b: "9H 글래스 코팅 + 휠·창문 발수까지. 출장 불가, 자체 워크샵 1일 입고.",
  meta: [["소요", "1일"], ["가격", "680,000~"], ["방문", "워크샵"]] }];

const Programs = () =>
<section className="section section--surface" id="programs" style={{ backgroundColor: "rgb(218, 125, 21)" }}>
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">서비스 트랙</span>
        <h2 className="h-section" style={{ marginTop: 14 }}>가벼운 손세차부터<br /><em>세라믹 코팅까지.</em></h2>
        <p className="lede">차량 컨디션과 일정에 맞춰 네 가지 트랙으로 제공합니다.</p>
      </div>
      <div className="grid grid-4">
        {PROGRAMS.map((p, i) =>
      <article key={i} className="program">
            <span className="program__tag">{p.tag}</span>
            <h3 className="program__t">{p.t}</h3>
            <p className="program__b">{p.b}</p>
            <dl className="program__meta">
              {p.meta.map(([k, v]) =>
          <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          )}
            </dl>
          </article>
      )}
      </div>
    </div>
  </section>;


const STEPS = [
{ t: "60초 예약", b: "차종·위치·희망 시간을 입력하면 5분 안에 디테일러가 직접 확인합니다." },
{ t: "방문 알림", b: "시공 24시간 전, 1시간 전 두 번 자동 알림. 위치 변경은 12시간 전까지 가능합니다." },
{ t: "현장 시공", b: "전용 발전기·정수기 차량이 도착해 자체 전원·물로 작업합니다. 댁의 수도·전기 불필요." },
{ t: "완료 보고서", b: "전후 사진·시공 내역·다음 권장 시점을 카카오톡으로 전달드립니다." }];

const HowItWorks = ({ c }) =>
<section className="section section--reverse" id="how">
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">진행 방식</span>
        <h2 className="h-section" style={{ marginTop: 14 }}>예약부터 보고까지,<br /><em>네 단계로 끝납니다.</em></h2>
      </div>
      <div className="steps">
        {STEPS.map((s, i) =>
      <article key={i} className="step">
            <span className="step__num">STEP 0{i + 1}</span>
            <div className="step__line" />
            <h3 className="step__t">{s.t}</h3>
            <p className="step__b">{s.b}</p>
          </article>
      )}
      </div>
      <div className="note-card">
        <div className="note-card__icon"><Sparkle size={22} c={c} /></div>
        <p className="note-card__t">
          시공 당일 비가 오면 자동으로 무료 일정 변경. <b>실내 작업만 따로 진행</b>하는 옵션도 선택 가능합니다.
        </p>
      </div>
    </div>
  </section>;


const About = () =>
<section className="section" id="about">
    <div className="wrap">
      <div className="about">
        <div className="photo">
          <span className="photo__label">[ photo · 마스터 디테일러 인물 ]</span>
        </div>
        <div>
          <span className="eyebrow">시공자</span>
          <h2 className="h-section" style={{ marginTop: 14 }}>한 사람이 처음부터<br /><em>마감까지 책임집니다.</em></h2>
          <p className="lede" style={{ marginBottom: 8 }}>
            12년 동안 수입차 디테일링 워크샵을 운영하며 쌓은 손맛으로,
            출장 환경에서도 입고 시공 수준의 결과를 만듭니다.
          </p>
          <ul className="about__creds">
            <li><b>자격</b><span>IDA(국제 디테일링 협회) 인증 마스터 · KCDA 2급 강사</span></li>
            <li><b>경력</b><span>○○모터스 출고 PDI 협력 5년 / 수입차 워크샵 운영 7년</span></li>
            <li><b>미디어</b><span>○○매거진 2024 · 자동차 유튜브 채널 [ ... ] 출연</span></li>
          </ul>
          <div className="impact">
            <div><b>12,400</b><span>누적 시공 차량 (대)</span></div>
            <div><b>4.9</b><span>실사용자 평점 (5점 만점)</span></div>
            <div><b>0</b><span>시공 사고 (5년 무사고)</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>;


const REVIEWS = [
{ name: "민○○ 회원님", meta: "제네시스 G80 · 1년 이용",
  b: "평일 저녁 회사 주차장으로 와주셔서 정말 편했어요. 마감 디테일이 손세차장과 비교가 안 됩니다. 매달 정기로 갑니다." },
{ name: "이○○ 회원님", meta: "BMW M4 · 프리미엄 디테일링",
  b: "클레이바 마감 후 도장이 새 차로 돌아왔습니다. 작업 사진을 단계별로 보내주셔서 신뢰가 갔어요." },
{ name: "박○○ 회원님", meta: "테슬라 모델Y · 코팅",
  b: "무광택 도장 가능한 디테일러를 찾기 어려웠는데, 친환경 폼이라 안심하고 맡겼습니다. 광택은 두 달째 유지." },
{ name: "정○○ 회원님", meta: "카니발 · 실내+외부 풀케어",
  b: "아이 카시트 자국까지 깨끗하게 잡아주셨어요. 헤드라이너에 묻은 자국도 다 사라졌습니다." }];

const Testimonials = () =>
<section className="section section--surface" id="reviews">
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">고객 후기</span>
        <h2 className="h-section" style={{ marginTop: 14 }}>다시 부르고,<br /><em>또 부르는 이유.</em></h2>
      </div>
      <div className="grid grid-2">
        {REVIEWS.map((r, i) =>
      <article key={i} className="review">
            <div className="review__quote">"</div>
            <p className="review__b">{r.b}</p>
            <div className="review__who">
              <div className="review__avatar">{r.name.slice(0, 1)}</div>
              <div>
                <div className="review__name">{r.name}</div>
                <div className="review__meta">{r.meta}</div>
              </div>
            </div>
          </article>
      )}
      </div>
    </div>
  </section>;


const FAQS = [
{ q: "방문 시공할 때 수도와 전기를 빌려야 하나요?",
  a: "아니요. 전용 발전기와 1000L 정수 탱크를 갖춘 출장 차량을 이용합니다. 댁의 전기·수도를 사용하지 않으며, 작업 후 폐수도 전량 회수합니다." },
{ q: "비 오는 날에는 어떻게 되나요?",
  a: "시공 12시간 전 일기예보 기준 강수확률 60% 이상이면 자동으로 일정 변경을 제안드립니다. 실내 작업만 진행하는 옵션도 선택 가능합니다." },
{ q: "세라믹 코팅은 출장으로 받을 수 없나요?",
  a: "코팅은 먼지·온습도 제어가 필수이기 때문에 자체 워크샵 입고로만 진행합니다. 입고 전후 픽업·딜리버리 서비스를 무상 제공합니다." },
{ q: "결제는 언제 진행되나요?",
  a: "시공 완료 후 현장에서 카드·계좌·간편결제 모두 가능합니다. 사전 결제는 받지 않습니다." },
{ q: "광택 30일 보증은 어떤 범위까지인가요?",
  a: "시공 부위에 한해 30일 이내 발생한 광택 저하·얼룩에 대해 동일 조건으로 무상 재시공합니다. 외부 사고·이물질로 인한 손상은 제외됩니다." },
{ q: "정기 멤버십이 있나요?",
  a: "월 2회 외부 손세차 + 분기 1회 실내 풀케어 묶음 멤버십을 운영합니다. 자세한 내용은 상담 시 안내드립니다." }];

const FAQ = () => {
  const [open, setOpen] = React.useState(0);
  return (
    <section className="section" id="faq">
      <div className="wrap">
        <div className="faq">
          <aside className="faq__aside">
            <span className="eyebrow">FAQ</span>
            <h2 className="h-section" style={{ marginTop: 14, fontSize: "clamp(26px,2.6vw,36px)" }}>
              자주 묻는<br />질문들.
            </h2>
            <p>답이 없는 질문이 있다면<br />편한 채널로 문의 주세요.</p>
            <a className="faq__channel" href="#">💬 카카오톡 상담 · @미스터카샤인</a>
            <a className="faq__channel" href="tel:0000">☎ 전화 상담 · 02-0000-0000</a>
          </aside>
          <div className="faq__list">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className={"faq__item " + (isOpen ? "faq__item--open" : "")}>
                  <button className="faq__q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                    <span>{f.q}</span>
                    <span className="faq__chev"><Chev /></span>
                  </button>
                  {isOpen && <p className="faq__a">{f.a}</p>}
                </div>);

            })}
          </div>
        </div>
      </div>
    </section>);

};

const PLANS = [
{ name: "손세차 정기", desc: "월 2회 외부 손세차로 컨디션 유지.",
  price: "89,000", unit: "/ 월",
  feats: ["월 2회 외부 손세차 (방문)", "휠·창문 발수 무상", "우천 자동 일정 변경"],
  cta: "멤버십 신청" },
{ name: "올라운드 케어", desc: "외부 + 실내까지 한 번에. 가장 인기 있는 플랜.",
  price: "159,000", unit: "/ 월", featured: true, badge: "가장 인기",
  feats: ["월 2회 외부 + 분기 1회 실내 풀케어", "30일 광택 무상 보증", "우선 예약 (24시간 응답)", "연 1회 휠 디테일링 무상"],
  cta: "올라운드 신청" },
{ name: "단발 시공", desc: "필요할 때만. 멤버십 가입 없이.",
  price: "49,000~", unit: "/ 회",
  feats: ["트랙별 단건 예약", "현장 결제", "30일 광택 무상 보증"],
  cta: "단발 신청" }];

const Pricing = ({ onCta }) =>
<section className="section section--surface" id="pricing" style={{ backgroundColor: "rgb(251, 132, 11)" }}>
    <div className="wrap">
      <div className="section-head">
        <span className="eyebrow">멤버십 · 요금</span>
        <h2 className="h-section" style={{ marginTop: 14 }}>한 번이든, 매달이든.<br /><em>부담 없이.</em></h2>
        <p className="lede">표시 가격은 부가세 포함, 추가 부재료비는 없습니다.</p>
      </div>
      <div className="pricing">
        {PLANS.map((p, i) =>
      <article key={i} className={"plan " + (p.featured ? "plan--featured" : "")}>
            {p.badge && <span className="plan__badge">{p.badge}</span>}
            <h3 className="plan__name">{p.name}</h3>
            <p className="plan__desc">{p.desc}</p>
            <div className="plan__price">
              <b>{p.price}</b><span>원 {p.unit}</span>
            </div>
            <ul className="plan__features">
              {p.feats.map((f, j) => <li key={j}>{f}</li>)}
            </ul>
            <button className={"btn " + (p.featured ? "btn--primary" : "btn--ghost") + " btn--block"}
        onClick={onCta} style={{ marginTop: "auto" }}>
              {p.cta}
            </button>
          </article>
      )}
      </div>
    </div>
  </section>;


// ── Apply form ────────────────────────────────────────────────
function ApplyForm({ c }) {
  const [form, setForm] = React.useState({
    name: "", phone: "", status: "", time: ""
  });
  const [errs, setErrs] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);
  const upd = (k, v) => {setForm((p) => ({ ...p, [k]: v }));setErrs((p) => ({ ...p, [k]: undefined }));};

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.name.trim()) er.name = "이름을 입력해 주세요.";
    if (!/^[0-9-+ ]{8,}$/.test(form.phone)) er.phone = "연락처 형식을 확인해 주세요.";
    if (!form.status) er.status = "현재 상태를 선택해 주세요.";
    if (!form.time) er.time = "선호 시간대를 선택해 주세요.";
    setErrs(er);
    if (Object.keys(er).length === 0) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="form form__success">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
          <circle cx="28" cy="28" r="26" stroke="currentColor" strokeWidth="1.5" />
          <path d="M18 28 L 25 35 L 39 21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3>접수 완료</h3>
        <p>영업일 기준 4시간 안에 카카오톡으로 시공 일정과 견적을 회신드립니다. 감사합니다.</p>
        <button type="button" className="btn btn--ghost" onClick={() => {setSubmitted(false);setForm({ name: "", phone: "", status: "", time: "" });}}>
          다시 신청하기
        </button>
      </div>);

  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className={"field " + (errs.name ? "field--err" : "")}>
        <label htmlFor="f-name">이름</label>
        <input id="f-name" type="text" value={form.name} onChange={(e) => upd("name", e.target.value)} placeholder="홍길동" autoComplete="name" />
        {errs.name && <span className="field__err">{errs.name}</span>}
      </div>
      <div className={"field " + (errs.phone ? "field--err" : "")}>
        <label htmlFor="f-phone">연락처</label>
        <input id="f-phone" type="tel" value={form.phone} onChange={(e) => upd("phone", e.target.value)} placeholder="010-0000-0000" autoComplete="tel" />
        {errs.phone && <span className="field__err">{errs.phone}</span>}
      </div>
      <div className={"field " + (errs.status ? "field--err" : "")}>
        <label htmlFor="f-status">현재 상태</label>
        <select id="f-status" value={form.status} onChange={(e) => upd("status", e.target.value)}>
          <option value="">선택해 주세요</option>
          <option value="first">처음 의뢰합니다</option>
          <option value="repeat">정기 멤버십 검토 중</option>
          <option value="coating">세라믹 코팅 문의</option>
          <option value="biz">법인 / 차량 다수 보유</option>
        </select>
        {errs.status && <span className="field__err">{errs.status}</span>}
      </div>
      <div className={"field " + (errs.time ? "field--err" : "")}>
        <label>선호 시간대</label>
        <div className="radio-row">
          {[
          ["morning", "오전 9–12시"],
          ["afternoon", "오후 12–18시"],
          ["evening", "저녁 18–21시"]].
          map(([v, lbl]) =>
          <React.Fragment key={v}>
              <input id={"t-" + v} type="radio" name="time" value={v} checked={form.time === v} onChange={() => upd("time", v)} />
              <label htmlFor={"t-" + v}>{lbl}</label>
            </React.Fragment>
          )}
        </div>
        {errs.time && <span className="field__err">{errs.time}</span>}
      </div>
      <button type="submit" className="btn btn--primary btn--block" style={{ marginTop: 8, height: 54 }}>
        예약 신청하기
      </button>
      <p className="form__footer">
        제출하신 개인정보는 상담 목적으로만 사용되며, 응답 완료 후 <b>30일 내 자동 파기</b>됩니다.
        제3자 제공 및 마케팅 활용은 일절 없습니다.
      </p>
    </form>);

}

const Apply = ({ c }) =>
<section className="section" id="apply">
    <div className="wrap">
      <div className="apply">
        <div>
          <span className="eyebrow">예약 신청</span>
          <h2 className="h-section" style={{ marginTop: 14 }}>지금 신청하면<br /><em>이번 주말에 만나요.</em></h2>
          <p className="lede">
            영업일 기준 4시간 안에 카카오톡으로 회신드립니다.<br />
            상담은 무료이고, 마음에 들지 않으면 그냥 보내셔도 됩니다.
          </p>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <Clock size={20} c={c} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>운영 시간</div>
                <div style={{ fontSize: 13, color: "var(--c-muted)", marginTop: 2 }}>월–토 09:00 ~ 21:00 · 일/공휴일 휴무</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <Sparkle size={20} c={c} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>방문 가능 지역</div>
                <div style={{ fontSize: 13, color: "var(--c-muted)", marginTop: 2 }}>서울 전 지역 · 경기 일부 (성남·과천·하남 등)</div>
              </div>
            </div>
          </div>
        </div>
        <ApplyForm c={c} />
      </div>
    </div>
  </section>;


const Footer = () =>
<footer className="foot" id="footer">
    <div className="wrap">
      <div className="foot__grid">
        <div className="foot__brand">
          <div className="brand">
            <span className="brand__mark" aria-hidden="true" />
            <span>미스터카샤인</span>
          </div>
          <p>댁 앞에서, 새 차처럼.<br />출장 디테일링 살롱.</p>
        </div>
        <div>
          <h4>서비스</h4>
          <ul>
            <li>외부 손세차</li>
            <li>실내+외부 풀케어</li>
            <li>프리미엄 디테일링</li>
            <li>세라믹 코팅 (입고)</li>
          </ul>
        </div>
        <div>
          <h4>연락</h4>
          <ul>
            <li>kakao @미스터카샤인</li>
            <li>02-0000-0000</li>
            <li>hello@mrcarshine.kr</li>
            <li>월–토 09:00 ~ 21:00</li>
          </ul>
        </div>
        <div>
          <h4>사업자 정보</h4>
          <ul>
            <li>상호 · (주)미스터카샤인</li>
            <li>대표 · ○○○</li>
            <li>사업자등록 · 000-00-00000</li>
            <li>본점 · 서울 [ ... ]</li>
          </ul>
        </div>
      </div>
      <div className="foot__legal">
        <span>© 2026 미스터카샤인. All rights reserved.</span>
        <span>이용약관 · 개인정보처리방침 · 환불 정책</span>
      </div>
    </div>
  </footer>;


const StickyCTA = ({ show, onCta }) =>
<div className={"sticky-cta " + (show ? "sticky-cta--show" : "")} aria-hidden={!show}>
    <div className="sticky-cta__txt">
      <span className="sticky-cta__t">이번 주말 출장 가능</span>
      <span className="sticky-cta__s">남은 슬롯 3건 · 60초 예약</span>
    </div>
    <button className="btn btn--primary btn--sm" onClick={onCta}>예약 신청하기</button>
  </div>;


// ── App ──────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const palette = PALETTES[t.palette] || PALETTES.salon;
  const c = palette;

  // Inject CSS variables for current palette.
  React.useEffect(() => {
    const root = document.documentElement;
    KEYS.forEach((k) => root.style.setProperty(`--c-${k}`, palette[k]));
    root.style.setProperty("--headline-weight", String(t.headlineWeight));
    const rMap = { sharp: ["4px", "6px", "10px", "16px"], soft: ["6px", "10px", "16px", "24px"], round: ["10px", "16px", "22px", "32px"] };
    const r = rMap[t.roundness] || rMap.soft;
    root.style.setProperty("--r-sm", r[0]);
    root.style.setProperty("--r-md", r[1]);
    root.style.setProperty("--r-lg", r[2]);
    root.style.setProperty("--r-xl", r[3]);
    const fMap = {
      serif: '"Noto Serif KR", "Times New Roman", serif',
      sans: '"Noto Sans KR", system-ui, sans-serif',
      display: '"Noto Serif KR", "Times New Roman", serif'
    };
    root.style.setProperty("--font-serif", fMap[t.headlineFont] || fMap.serif);
  }, [t]);

  // Sticky CTA visibility based on scroll.
  const [showSticky, setShowSticky] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goApply = () => {
    const el = document.getElementById("apply");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const {
    TweaksPanel, TweakSection, TweakColor, TweakRadio, TweakToggle, TweakSlider
  } = window;

  return (
    <>
      <Nav onCta={goApply} />
      <Hero c={c} onCta={goApply} />
      <PainPoints />
      <Differentiators c={c} />
      <Programs />
      <HowItWorks c={c} />
      <About />
      <Testimonials />
      <FAQ />
      <Pricing onCta={goApply} />
      <Apply c={c} />
      <Footer />

      {t.showSticky && <StickyCTA show={showSticky} onCta={goApply} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette">
          {/* Palette options are swatch arrays — value/onChange resolve to palette key. */}
          <TweakColor label="Mood"
          value={PALETTES[t.palette].swatch}
          options={Object.values(PALETTES).map((p) => p.swatch)}
          onChange={(arr) => {
            const k = Object.keys(PALETTES).find(
              (k) => JSON.stringify(PALETTES[k].swatch) === JSON.stringify(arr)
            ) || "salon";
            setTweak("palette", k);
          }} />
        </TweakSection>
        <TweakSection label="Typography">
          <TweakSlider label="Headline weight" value={t.headlineWeight} min={400} max={900} step={100}
          onChange={(v) => setTweak("headlineWeight", v)} />
          <TweakRadio label="Heading font" value={t.headlineFont}
          options={[{ value: "serif", label: "Serif" }, { value: "sans", label: "Sans" }]}
          onChange={(v) => setTweak("headlineFont", v)} />
        </TweakSection>
        <TweakSection label="Shape">
          <TweakRadio label="Corner" value={t.roundness}
          options={[{ value: "sharp", label: "Sharp" }, { value: "soft", label: "Soft" }, { value: "round", label: "Round" }]}
          onChange={(v) => setTweak("roundness", v)} />
        </TweakSection>
        <TweakSection label="UI">
          <TweakToggle label="Sticky CTA" value={t.showSticky}
          onChange={(v) => setTweak("showSticky", v)} />
        </TweakSection>
      </TweaksPanel>
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
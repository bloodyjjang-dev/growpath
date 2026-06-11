/* ============================================================
   블크업 13기 — 단일 페이지 랜딩
   4주 만에 수익화 블로그
   ============================================================ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "dawn",
  "headlineWeight": 700,
  "showSticky": true,
  "showFloatCards": true,
  "heroLayout": "split"
} /*EDITMODE-END*/;

/* ── palettes (key → CSS vars) ── */
const PALETTES = {
  dawn: {
    cream: "#f6efe3", peachSoft: "#f4dccb", peach: "#e9a986",
    orange: "#d76a3a", green: "#143d2c", greenSoft: "#2f5a44",
    ink: "#1a1815", muted: "#6b665d"
  },
  forest: {
    cream: "#eef0e7", peachSoft: "#d8e2cf", peach: "#a8b894",
    orange: "#c9743a", green: "#0e2a1f", greenSoft: "#2b4a36",
    ink: "#13180f", muted: "#5d6655"
  },
  dusk: {
    cream: "#f4ebe1", peachSoft: "#ecc9b3", peach: "#d99572",
    orange: "#b8482a", green: "#2c2018", greenSoft: "#4a3727",
    ink: "#1a120c", muted: "#766458"
  }
};

const { useState, useEffect, useMemo } = React;

/* render a string with \n as <br/> line breaks */
function ML({ text }) {
  return String(text == null ? "" : text).split("\n").map((line, i) =>
  <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
  );
}

/* ============================================================
   SVG ILLUSTRATIONS
   ============================================================ */

function SvgGrowthChart({ size = 240, c }) {
  return (
    <svg viewBox="0 0 240 160" width="100%" height={size} style={{ display: "block" }}>
      <rect x="0" y="0" width="240" height="160" fill={c.cream} />
      {/* baseline grid */}
      {[1, 2, 3].map((i) =>
      <line key={i} x1="20" x2="220" y1={40 + i * 30} y2={40 + i * 30}
      stroke={c.ink} strokeOpacity="0.07" strokeDasharray="2 4" />
      )}
      {/* axes */}
      <line x1="20" y1="130" x2="220" y2="130" stroke={c.green} strokeWidth="1.5" />
      {/* bars */}
      {[
      { x: 36, h: 14 }, { x: 64, h: 22 }, { x: 92, h: 32 },
      { x: 120, h: 46 }, { x: 148, h: 62 }, { x: 176, h: 82 }, { x: 204, h: 96 }].
      map((b, i) =>
      <rect key={i} x={b.x - 8} y={130 - b.h} width="16" height={b.h}
      rx="3" fill={i === 6 ? c.orange : c.peach} opacity={i === 6 ? 1 : 0.7} />
      )}
      {/* trend line */}
      <path d="M 36 118 L 64 110 L 92 100 L 120 86 L 148 70 L 176 52 L 204 36"
      stroke={c.green} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {[36, 64, 92, 120, 148, 176, 204].map((x, i) => {
        const y = [118, 110, 100, 86, 70, 52, 36][i];
        return <circle key={i} cx={x} cy={y} r={i === 6 ? 5 : 2.5}
        fill={i === 6 ? c.orange : c.green} />;
      })}
      {/* end label */}
      <g transform="translate(168 14)">
        <rect width="60" height="22" rx="11" fill={c.green} />
        <text x="30" y="15" textAnchor="middle" fontFamily="ui-monospace, monospace"
        fontSize="10" fill={c.cream}>+312%</text>
      </g>
    </svg>);

}

function SvgPenSpark({ size = 56, c }) {
  return (
    <svg viewBox="0 0 56 56" width={size} height={size}>
      <path d="M14 42 L34 22 L42 30 L22 50 Z" fill="none" stroke={c.green} strokeWidth="2" strokeLinejoin="round" />
      <path d="M34 22 L40 16 L46 22 L42 28" fill={c.orange} stroke={c.green} strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 42 L18 46" stroke={c.green} strokeWidth="2" strokeLinecap="round" />
      {/* sparks */}
      <circle cx="48" cy="10" r="1.6" fill={c.orange} />
      <circle cx="44" cy="6" r="1" fill={c.orange} />
      <circle cx="52" cy="14" r="1.2" fill={c.orange} />
    </svg>);

}

function SvgChatLoop({ size = 56, c }) {
  return (
    <svg viewBox="0 0 56 56" width={size} height={size}>
      <rect x="6" y="10" width="30" height="22" rx="6" fill="none" stroke={c.green} strokeWidth="2" />
      <path d="M14 32 L14 38 L20 32" fill="none" stroke={c.green} strokeWidth="2" strokeLinejoin="round" />
      <rect x="20" y="24" width="30" height="22" rx="6" fill={c.peachSoft} stroke={c.green} strokeWidth="2" />
      <path d="M42 46 L42 52 L36 46" fill="none" stroke={c.green} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="29" cy="35" r="1.5" fill={c.orange} />
      <circle cx="35" cy="35" r="1.5" fill={c.orange} />
      <circle cx="41" cy="35" r="1.5" fill={c.orange} />
    </svg>);

}

function SvgCompass({ size = 56, c }) {
  return (
    <svg viewBox="0 0 56 56" width={size} height={size}>
      <circle cx="28" cy="28" r="20" fill="none" stroke={c.green} strokeWidth="2" />
      <circle cx="28" cy="28" r="3" fill={c.orange} />
      <path d="M28 28 L36 16 L30 28 Z" fill={c.orange} />
      <path d="M28 28 L20 40 L26 28 Z" fill={c.green} opacity="0.4" />
      <line x1="28" y1="6" x2="28" y2="10" stroke={c.green} strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="46" x2="28" y2="50" stroke={c.green} strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="28" x2="10" y2="28" stroke={c.green} strokeWidth="2" strokeLinecap="round" />
      <line x1="46" y1="28" x2="50" y2="28" stroke={c.green} strokeWidth="2" strokeLinecap="round" />
    </svg>);

}

function SvgCoinStack({ size = 28, c, light }) {
  const stroke = light ? c.cream : c.green;
  const fill = light ? c.peach : c.orange;
  return (
    <svg viewBox="0 0 28 28" width={size} height={size}>
      <ellipse cx="14" cy="20" rx="9" ry="3" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <ellipse cx="14" cy="14" rx="9" ry="3" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <ellipse cx="14" cy="8" rx="9" ry="3" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <path d="M5 8 L5 20 M23 8 L23 20" stroke={stroke} strokeWidth="1.5" />
    </svg>);

}

function SvgCheck({ size = 18, c }) {
  return (
    <svg viewBox="0 0 18 18" width={size} height={size}>
      <path d="M4 9 L8 13 L14 6" stroke={c.cream} strokeWidth="2.4" fill="none"
      strokeLinecap="round" strokeLinejoin="round" />
    </svg>);

}

/* ============================================================
   SECTIONS
   ============================================================ */

function Nav({ c }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a className="brand" href="#top">
          <span className="brand-mark">블</span>
          <span>블크업<span style={{ color: c.muted, fontWeight: 500, marginLeft: 6, fontSize: "15px" }}>13기
</span></span>
        </a>
        <div className="nav-links">
          <a href="#program">프로그램</a>
          <a href="#how">진행과정
</a>
          <a href="#price">수강료
</a>
          <a href="#faq">자주 묻는 질문</a>
        </div>
        <a href="#apply" className="nav-cta">13기 사전 신청</a>
      </div>
    </nav>);}
function Hero({ c, t }) {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="hero-grid" style={t.heroLayout === "centered" ? { gridTemplateColumns: "1fr", textAlign: "center" } : undefined}>
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <span style={{ fontSize: "15px" }}>13기 모집 : 6.11~ 6.21  시작일 :  6월 22일 시작
              </span>
            </div>
            <h1 className="hero-h">
              4주 만에,<br />
              방치된 블로그를<br />
              <em>수익화 블로그</em>로
            </h1>
            <p className="hero-sub" style={{ fontFamily: '"Noto Serif KR"' }}>
              정체기에 막힌 글, 막막한 수익화 방향, 손이 가지 않는 발행.<br />
              블크업은 1:1 피드백과 클로드 기반 글쓰기 자동화로<br />
              28일동안 함께 발행하고 성장시키는 코칭 프로그램입니다.
            </p>
            <div className="hero-ctas" style={t.heroLayout === "centered" ? { justifyContent: "center" } : undefined}>
              <a href="#apply" className="btn btn-primary">13기 사전 신청하기 →</a>
              <a href="#program" className="btn btn-ghost">프로그램 자세히 보기</a>
            </div>
            <div className="trust-row" style={t.heroLayout === "centered" ? { maxWidth: 520, margin: "0 auto" } : undefined}>
              <div className="trust-cell"><div className="num">200명+</div><div className="lbl">누적 수강생</div></div>
              <div className="trust-cell"><div className="num">4.9 / 5</div><div className="lbl">수강생 만족도</div></div>
              <div className="trust-cell"><div className="num">12기</div><div className="lbl">검증된 커리큘럼</div></div>
            </div>
          </div>

          {t.heroLayout !== "centered" && <div className="hero-card-stack">
              <div className="hero-card hero-card-main">
                <div className="hcm-bar">
                  <span className="hcm-dot" /><span className="hcm-dot" /><span className="hcm-dot" />
                  <span className="hcm-url">myblog.naver.com /hanabro00</span>
                </div>
                <div className="hcm-body">
                  <div className="hcm-title">이번 주 발행 리포트
</div>
                  <div className="hcm-meta">2026.05.18 — 2026.05.24 · 7일</div>
                  <SvgGrowthChart size={150} c={c} />
                  <div style={{ marginTop: 18 }}>
                    <div className="hcm-line w90" />
                    <div className="hcm-line w70" />
                    <div className="hcm-line w55" />
                  </div>
                  <div className="hcm-cta-row">
                    <span className="hcm-pill">✓ 1:1 피드백 완료</span>
                    <span style={{ fontSize: 12, color: c.muted }}>3분 전 </span>
                  </div>
                </div>
              </div>

              {t.showFloatCards && <>
                  <div className="float-card fc-1">
                    <div className="fc-ico"><SvgCheck c={c} /></div>
                    <div>
                      <div className="fc-t">발행 7/7일</div>
                      <div className="fc-s">이번 주 연속 발행 달성</div>
                    </div>
                  </div>
                  <div className="float-card fc-2">
                    <div className="fc-ico"><SvgCoinStack c={c} /></div>
                    <div>
                      <div className="fc-t">첫 수익 +12,400원</div>
                      <div className="fc-s">애드포스트 · 4주차</div>
                    </div>
                  </div>
                </>
            }
            </div>
          }
        </div>
      </div>
    </section>);

}

function PainPoints({ c }) {
  const items = [
  { n: "01", t: "AI를 활용하는게 어려워 글이 막혀버린 정체기 블로거", b: "예전엔 술술 써졌는데 지금은 한 줄도 시작이 어려운 분. AI 활용이 막연하게 어려운 분. " },
  { n: "02", t: "수익화 방향을 못 잡은 분", b: "주제는 있는데 어떤 키워드로, 어디서 돈이 나오는지 막막한 분." },
  { n: "03", t: "엔잡으로 부수입을 만들고 싶은 분", b: "본업은 유지하면서, 클로드를 활용하여 하루 10분으로 두 번째 소득을 만들고 싶은 분." },
  { n: "04", t: "혼자서 꾸준함이 안 되는 분", b: "발행 계획을 세워도 2주를 못 넘기는 분. 함께 가야 끝까지 갑니다." }];

  return (
    <section id="for-who">
      <div className="wrap">
        <div className="section-head">
          <div className="section-eyebrow" style={{ fontSize: "13px" }}>FOR WHO</div>
          <h2 className="section-h">이런 분께 추천합니다</h2>
          <p className="section-sub">블크업 13기는 다음의 네 가지 상황에 있는 분들을 위해 설계되었습니다.</p>
        </div>
        <div className="pain-grid">
          {items.map((it) =>
          <div className="pain-card" key={it.n}>
              <div className="pain-num">{it.n}</div>
              <div className="pain-t">{it.t}</div>
              <div className="pain-b">{it.b}</div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

function Differentiators({ c }) {
  const items = [
  { tag: "FEEDBACK", Ico: SvgChatLoop, t: "1:1 피드백", b: "코치가 매일 글을 직접 읽고, 키워드 · 구조 · 톤까지 한 줄 한 줄 코멘트합니다. \n그룹방의 박수보다, 한 사람의 정확한 시선이 글을 바꿉니다." },
  { tag: "AUTOMATION", Ico: SvgPenSpark, t: "클로드로 자동화 글쓰기", b: "키워드 수집 · 초안 생성 · 톤 정리까지, 검증된 페르소나 프롬프트 템플릿으로 글 한 편 쓰는 시간을 평균 90분 → 10분으로 줄입니다." },
  { tag: "DIRECTION", Ico: SvgCompass, t: "수익화 방향성 코칭", b: "내 블로그가 어떤 카테고리에서, 어떤 수익 채널(체험 · 대행 · 셀링 ·강의)로 가야 하는지 4주 차에 개인 맞춤 로드맵을 받습니다." }];

  return (
    <section id="why">
      <div className="wrap">
        <div className="section-head">
          <div className="section-eyebrow" style={{ fontSize: "13px" }}>WHY 블크업</div>
          <h2 className="section-h">다른 블로그 강의와<br />무엇이 다른가</h2>
          <p className="section-sub">강의 영상만 듣고 끝나는 프로그램이 아니라,  코치가 피드백 하며 방향성을 함께 찾아갑니다.</p>
        </div>
        <div className="diff-grid">
          {items.map((it, i) =>
          <div className="diff-card" key={i}>
              <div className="diff-ico"><it.Ico size={36} c={c} /></div>
              <div className="diff-tag">{it.tag}</div>
              <div className="diff-t">{it.t}</div>
              <div className="diff-b"><ML text={it.b} /></div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

function Programs({ c }) {
  return (
    <section id="program">
      <div className="wrap">
        <div className="section-head">
          <div className="section-eyebrow" style={{ fontSize: "13px" }}>PROGRAM</div>
          <h2 className="section-h">28일 블크업 트랙</h2>
          <p className="section-sub">하나의 정교한 트랙으로 코치와 함께 4주 커리큘럼을 함께 진행합니다.</p>
        </div>
        <div className="prog-grid">
          {[
          { wk: "줌사전미팅", t: "블로그 진단 & 방향 설정", d: "내 블로그의 현재  · 카테고리 적합도 · 수익 잠재력을 진단합니다.", meta: [["주제", "방향성"], ["방법 ", "줌미팅"], ["사전 개별진단", "1회"]] },
          { wk: "WEEK 1-2", t: "돈되는 글쓰기에 대한 이해 + 키워드 글쓰기 실전코칭 ", d: "", meta: [["주제", "돈되는 글쓰기"], ["산출물", "6편 이상"], ["코칭", "매일 피드백 "]] },
          { wk: "WEEK 3-4", t: "페르소나 세팅 + 자동화 글쓰기", d: "", meta: [["주제", "글쓰기 자동화 "], ["산출물", "클로드 글쓰기"], ["코칭", "상시 질의 응답 "]] }].
          map((p, i) =>
          <div className="prog-card" key={i}>
              <div className="prog-tag">{p.wk}</div>
              <div className="prog-t"><ML text={p.t} /></div>
              <div className="prog-d"><ML text={p.d} /></div>
              <div className="prog-meta">
                {p.meta.map((m, j) =>
              <div key={j} style={{ fontSize: "13px" }}>
                    <div className="mk" style={{ fontSize: "13px" }}>{m[0]}</div>
                    <div className="mv" style={{ textAlign: "left", fontSize: "13px" }}>{m[1]}</div>
                  </div>
              )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

function HowItWorks({ c }) {
  const steps = [
  { n: "STEP 01", t: "사전 신청 & 진단", b: "신청서 작성 후 1:1 진단  줌미팅을 위해 개별 연락 드립니다." },
  { n: "STEP 02", t: "온보딩 키트 발송", b: "1. Claude Code 사전 설치 영상\n2. 페르소나 만들기 프롬프트\n3. 네이버 데이터랩 분석기\n4. 네이버 블로그 자동화 글쓰기 프로그램" },
  { n: "STEP 03", t: "4주 발행 사이클", b: "매일 발행 · 매일 피드백 · 주1회 라이브 줌강의 " },
  { n: "STEP 04", t: "카카오톡방 운영, 지속적인 질의 응답 ", b: "수익화 로드맵이 완료 된 이후라도 카톡은 지속적으로 유지되며 코치의 질의 응답이 이어집니다. " }];

  return (
    <section className="how" id="how">
      <div className="wrap">
        <div className="section-head">
          <div className="section-eyebrow" style={{ fontSize: "13px" }}>HOW IT WORKS</div>
          <h2 className="section-h">신청부터 졸업까지<br />이렇게 진행됩니다</h2>
          <p className="section-sub">28일이라는 짧은 시간 안에 결과를 만들려면, 단계가 흔들리지 않아야 합니다.</p>
        </div>
        <div className="how-grid">
          {steps.map((s, i) =>
          <div className="how-step" key={i}>
              <div className="how-num">{s.n}</div>
              <div className="how-t">{s.t}</div>
              <div className="how-b"><ML text={s.b} /></div>
            </div>
          )}
        </div>
        <div className="how-foot">
          <p>
            <b style={{ color: c.peach }}>13기 모집 마감</b>까지 약 2주 남았습니다. 선착순 마감.
          
          </p>
          <a href="#apply" className="btn btn-primary">사전 신청 →</a>
        </div>
      </div>
    </section>);

}

function Instructor({ c }) {
  return (
    <section id="about">
      <div className="wrap">
        <div className="inst-grid">
          <div className="photo-ph" style={{ backgroundImage: "url('assets/coach.png')", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundColor: "var(--c-peachSoft)" }}></div>
          <div>
            <div className="section-eyebrow">INSTRUCTOR</div>
            <div className="inst-name" style={{ textAlign: "left" }}>파트너 : 화이얌 코치</div>
            <div className="inst-role">BLOG GROWTH COACH</div>
            <p className="inst-bio">네이버 블로그를 3년간 운영하며 AI 클로드를 통해 블로그 글쓰기 자동화를 만들어 낸 블로그 코치입니다.
더블업 강의, 블크업 12기 특강을 진행했고, 현재는 월간 클로드 딥러닝 과정을 진행중에 있습니다. 

            </p>
            <ul className="inst-list">
              <li>현직 프로그래머 재직 25년차</li>
              <li>AI 솔루션 공부 3년차 — 코드가 아닌 '생각'을 단련하는 중</li>
              <li>경남도청 CEO 대상 AI 활용 강의</li>
              <li>20년 개발 내공으로 만든 AI 블로그 글쓰기 자동화 직접 운영</li>
            </ul>
            <div className="inst-stats">
              <div><div className="n"></div><div className="l"></div></div>
              <div><div className="n"></div><div className="l"></div></div>
              <div><div className="n"></div><div className="l"></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>);}

function Testimonials({ c }) {
  const items = [
  { name: "ㅈㅎ 멤버님", st: "11기 · 직장인 / 30대", body: "3년 동안 방치했던 블로그가 4주차에 일 방문 500명을 찍었습니다. 매주 코치님 피드백이 정말 정확해요. 칭찬보다는 ‘이 문장은 검색이 안 됩니다’ 식의 솔직한 코멘트가 좋았습니다." },
  { name: "ㅈ ㅇ 멤버님", st: "12기 · 프리랜서 / 30대", body: "클로드 프롬프트가 진짜 베스트였어요. 글 한 편 쓰는데 두 시간 걸리던 게 30분으로 줄었고, 그 시간을 키워드 리서치에 쓰니까 노출이 다르더라고요." },
  { name: "ㅅㅇ 회원님", st: "10기 · 자영업 / 40대", body: "수익화 방향을 못 잡고 막연했는데, 4주차 1:1에서 ‘대행 마케팅으로 가세요’ 라고 정확히 짚어주셨어요. \n두 달 뒤 첫 대행 수익 20만원을 찍었습니다." },
  { name: "ㄱㅎ 회원님", st: "11기 · 워킹맘 / 30대", body: "혼자라면 2주도 못 갔을 거예요. 라이브에서 다른 분들 발행하는 모습 보니까 저도 자연스럽게 책상에 앉게 되더라고요. 28일이 정말 빠르게 갔습니다." }];

  return (
    <section id="reviews">
      <div className="wrap">
        <div className="section-head">
          <div className="section-eyebrow">REVIEWS</div>
          <h2 className="section-h">블크업 기존 수강자의 후기</h2>
          <p className="section-sub">수강생 후기는 모두 가명으로 표기합니다.</p>
        </div>
        <div className="test-grid">
          {items.map((t, i) =>
          <div className="test-card" key={i}>
              <div className="test-stars">★★★★★</div>
              <p className="test-body">“<ML text={t.body} />”</p>
              <div className="test-by">
                <div className="test-av">{t.name[0]}</div>
                <div>
                  <div className="test-name">{t.name}</div>
                  <div className="test-state">{t.st}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

function FAQ({ c }) {
  const items = [
  { q: "블로그 운영 경험이 전혀 없어도 괜찮나요?", a: "네. 12기 수강생의 약 40%가 블로그 개설 1년 미만의 입문자입니다. WEEK 1에서 진단과 함께 기초를 잡아드리니 안심하고 신청해 주세요." },
  { q: "주 몇 편을 발행해야 하나요?", a: "매일 발행을 권장합니다. 클로드 자동화 템플릿을 익히면 한 편당 평균 10분 정도 소요됩니다. 하루 30분 정도의 시간을 확보해 주세요." },
  { q: "어떤 블로그 플랫폼을 사용하나요?", a: "네이버 블로그를 메인으로 다룹니다. " },
  { q: "환불 정책은 어떻게 되나요?", a: "전자상거래법에 따라 진행 7일 이내에 청약철회가 가능합니다. 강의 시작전에는 100% 환불이 되고 강의가 시작된 이후로는 환불 및 다음 기수로의 이동이 어렵습니다. " },
  { q: "1:1 피드백은 어떻게 받나요?", a: "매일 발행한 글을 카페에 올리면 댓글로 섬세하게 피드백 해드립니다. " },
  { q: "수료 후에는 어떻게 되나요?", a: "수료생 전용 채널에 평생 초대됩니다. 다음 기수 코칭 라이브에도 옵저버로 참여 가능하며, 자료 업데이트도 지속해서 받으실 수 있습니다." }];

  const [open, setOpen] = useState(0);
  return (
    <section id="faq">
      <div className="wrap">
        <div className="section-head">
          <div className="section-eyebrow">FAQ</div>
          <h2 className="section-h">자주 묻는 질문</h2>
        </div>
        <div className="faq-grid">
          <aside className="faq-side">
            <h3>더 궁금한 점이 있다면</h3>
            <p>1:1 카카오톡 채널로 편하게 문의해
주세요. 댓글로 문의도 언제든 주세요. </p>
            <a href="#" className="chip">카카오톡 문의 →</a>
          </aside>
          <div className="faq-list">
            {items.map((it, i) => <div className={`faq-item${open === i ? " open" : ""}`} key={i}>
                <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                  <span>Q. {it.q}</span>
                  <span className="ico">+</span>
                </button>
                <div className="faq-a">{it.a}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}

function Pricing({ c }) {
  const tiers = [
  {
    name: "Basic", sub: "6월 21일 자정까지 신청",
    price: "399,000", per: "원 / 4주",
    feats: ["WEEK 1—4 전체 커리큘럼", "클로드 페르소나 프롬프트 제공 ", "줌 녹화본 6개월 제공 ", "주1회 줌 라이브 강의 "]
  },
  {
    name: "Earlybird", sub: "6월 17일 자정까지 신청", highlight: true,
    price: "349,000", per: "원 / 4주",
    feats: ["Basic 전체 포함", "매일 발행한 글 피드백 ", "수익화 1:1 코칭 1회권 무료 ", "13기 전용 카톡 코칭방"]
  },
  {
    name: "블크업 멤버 재수강 ", sub: "수익화 로드맵까지 완성하고 싶은 분",
    price: "249000", per: "원 / 4주",
    feats: ["Standard 전체 포함", "1:1 코칭 4회 (회당 45분)", "수익 채널 설계 컨설팅", "수료 후 90일 사후 지원"]
  }];

  return (
    <section id="price">
      <div className="wrap">
        <div className="section-head">
          <div className="section-eyebrow">PRICING</div>
          <h2 className="section-h">수강료 안내<br />같은 28일 트랙</h2>
          <p className="section-sub"></p>
        </div>
        <div className="price-grid">
          {tiers.map((p, i) =>
          <div className={`price-card${p.highlight ? " highlight" : ""}`} key={i}>
              {p.highlight && <div className="price-badge">가장 추천</div>}
              <div className="pr-name">{p.name}</div>
              <div className="pr-sub">{p.sub}</div>
              <div className="pr-price-row">
                <div className="pr-price">{p.price}</div>
                <div className="pr-per">{p.per}</div>
              </div>
              <ul className="pr-feat">
                {p.feats.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <div className="pr-cta">
                <a href="#apply" className={`btn ${p.highlight ? "btn-dark" : "btn-ghost"}`}>
                  {p.name} 신청하기
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

function Apply({ c }) {
  const [form, setForm] = useState({ name: "", phone: "", status: "", time: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "이름을 입력해 주세요.";
    if (!/^[0-9\-\s]{9,}$/.test(form.phone.trim())) e.phone = "연락 가능한 번호를 입력해 주세요.";
    if (!form.status) e.status = "현재 상태를 선택해 주세요.";
    if (!form.time) e.time = "상담 가능 시간대를 선택해 주세요.";
    return e;
  }

  function onSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setSubmitted(true);
    }
  }

  return (
    <section className="apply" id="apply">
      <div className="wrap">
        <div className="section-head">
          <div className="section-eyebrow">APPLY</div>
          <h2 className="section-h">13기 얼리버드 신청</h2>
          <p className="section-sub">6월 11 — 6월 21일 모집 · 6월 22일 시작 · 정원 15명
* 얼리버드 모집은 6월 17일 자정까지입니다. 
</p>
        </div>
        <div className="apply-grid">
          <div className="apply-left">
            <h3>먼저 신청하실수록<br />원하는 코치 슬롯을<br />고르실 수 있습니다.</h3>
            <p>입금 확인이 되면 1:1 줌미팅 스케쥴링을 위해
개별 연락 드립니다.</p>
            <ul className="apply-bullets">
              <li>수익화 방향성, 주제설정 어떤 질문도 OK </li>
              <li>개별 사전 줌미팅 1시간 소요 </li>
              <li>결제 전 코치 매칭 미리 확인</li>
            </ul>
            <div style={{ marginTop: "auto", paddingTop: 20, fontSize: 13, color: "color-mix(in oklab, " + c.cream + " 70%, transparent)" }}>
              문의 hanabro00@naver.com
            </div>
          </div>

          <div className="apply-form">
            {submitted ? <div className="success">
                <div className="success-ico">✓</div>
                <h3>신청이 접수되었습니다</h3>
                <p>
                  영업일 1일 이내 입력하신 번호로<br />
                  카톡 진단 콜 일정을 안내드립니다.<br />
                  잠시만 기다려 주세요. 감사합니다.
                </p>
              </div> : <form onSubmit={onSubmit} noValidate>
                <div className="form-field">
                  <label>이름</label>
                  <input type="text" placeholder="홍길동" value={form.name}
                onChange={(e) => update("name", e.target.value)} />
                  {errors.name && <div className="err">{errors.name}</div>}
                </div>
                <div className="form-field">
                  <label>연락처</label>
                  <input type="tel" placeholder="010-0000-0000" value={form.phone}
                onChange={(e) => update("phone", e.target.value)} />
                  {errors.phone && <div className="err">{errors.phone}</div>}
                </div>
                <div className="form-field">
                  <label>현재 상태</label>
                  <select value={form.status} onChange={(e) => update("status", e.target.value)}>
                    <option value="">선택해 주세요</option>
                    <option value="입문">블로그 입문 (운영 6개월 미만)</option>
                    <option value="정체">정체기 (운영 6개월 이상, 발행 멈춤)</option>
                    <option value="성장">성장 중 (수익화 방향이 막막)</option>
                    <option value="기타">기타</option>
                  </select>
                  {errors.status && <div className="err">{errors.status}</div>}
                </div>
                <div className="form-field">
                  <label>상담 가능 시간대</label>
                  <div className="radio-row">
                    {["오전 (10—12시)", "오후 (13—18시)", "저녁 (19—21시)"].map((opt) =>
                  <label key={opt} className={form.time === opt ? "on" : ""}>
                        <input type="radio" name="time" value={opt}
                    checked={form.time === opt} onChange={() => update("time", opt)} />
                        {opt}
                      </label>
                  )}
                  </div>
                  {errors.time && <div className="err">{errors.time}</div>}
                </div>
                <button type="submit" className="btn btn-primary submit-btn">
                  13기 사전 신청 보내기 →
                </button>
                <p className="privacy">
                  ※ 입력하신 개인정보는 상담 목적으로만 사용되며, 상담 종료 후 30일 내 안전하게 파기됩니다.
                  자세한 내용은 <a href="#">개인정보 처리방침</a>을 참고해 주세요.
                </p>
              </form>
            }
          </div>
        </div>
      </div>
    </section>);

}

function Footer({ c }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="brand">
              <span className="brand-mark" style={{ background: c.orange }}>블</span>
              <span>블크업 <span style={{ color: "color-mix(in oklab, " + c.cream + " 55%, transparent)", fontWeight: 500, marginLeft: 6, fontSize: 13 }}>13기
</span></span>
            </div>
            <p className="ftxt">
              정체기에 막힌 블로그를<br />
              4주 만에 다시 움직이게 합니다.
            </p>
          </div>
          <div>
            <h4>프로그램</h4>
            <ul>
              <li><a href="#program">28일 트랙</a></li>
              <li><a href="#how">수강료
</a></li>
              <li><a href="#price">요금제</a></li>
              <li><a href="#apply">13기 신청</a></li>
            </ul>
          </div>
          <div>
            <h4>고객지원</h4>
            <ul>
              <li>카카오톡 http://pf.kakao.com/_xlVFLb</li>
              <li>이메일 hanabro00@naver.com</li>
              <li>전화 070-0000-0000</li>
              <li>평일 10:00 — 19:00</li>
            </ul>
          </div>
          <div>
            <h4>회사 정보</h4>
            <ul>
              <li>유어브랜딩</li>
              <li>대표 김금주</li>
              <li>사업자 332-12-02698</li>
              <li>통신판매업 0000-서울-0000</li>
            </ul>
          </div>
        </div>
        <div className="footer-bot">
          <span>© 2026 BlogUp. All rights reserved.</span>
          <span>개인정보처리방침 · 이용약관 · 환불정책</span>
        </div>
      </div>
    </footer>);}

function StickyCTA({ c, show }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    function onScroll() {setVisible(window.scrollY > 600);}
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <div className={`sticky-cta${visible ? " show" : ""}`}>
      <span className="st-txt"><b>13기 모집중</b> · 6.11— 6.21</span>
      <a href="#apply" className="btn btn-primary">사전 신청 →</a>
    </div>);

}

/* ============================================================
   TWEAKS PANEL (uses globals from tweaks-panel.jsx)
   ============================================================ */

function Tweaks({ t, setT }) {
  const [open, setOpen] = window.useTweakOpen(false);

  const paletteOpts = useMemo(() => [
  [PALETTES.dawn.cream, PALETTES.dawn.orange, PALETTES.dawn.green],
  [PALETTES.forest.cream, PALETTES.forest.orange, PALETTES.forest.green],
  [PALETTES.dusk.cream, PALETTES.dusk.orange, PALETTES.dusk.green]],
  []);
  const paletteKey = ["dawn", "forest", "dusk"];
  const activePalette = paletteOpts[paletteKey.indexOf(t.palette)] || paletteOpts[0];

  return (
    <window.TweaksPanel open={open} onClose={() => setOpen(false)} title="Tweaks · 블크업 13기">
      <window.TweakSection title="팔레트">
        <window.TweakColor
          label="컬러 무드"
          value={activePalette}
          onChange={(v) => {
            const idx = paletteOpts.findIndex((p) => JSON.stringify(p) === JSON.stringify(v));
            if (idx >= 0) setT("palette", paletteKey[idx]);
          }}
          options={paletteOpts} />
        
      </window.TweakSection>
      <window.TweakSection title="타이포">
        <window.TweakRadio
          label="헤드라인 굵기"
          value={t.headlineWeight}
          onChange={(v) => setT("headlineWeight", v)}
          options={[{ label: "Reg", value: 500 }, { label: "Bold", value: 700 }, { label: "Black", value: 900 }]} />
        
      </window.TweakSection>
      <window.TweakSection title="레이아웃">
        <window.TweakRadio
          label="히어로 레이아웃"
          value={t.heroLayout}
          onChange={(v) => setT("heroLayout", v)}
          options={[{ label: "Split", value: "split" }, { label: "Center", value: "centered" }]} />
        
        <window.TweakToggle
          label="히어로 플로팅 카드"
          value={t.showFloatCards}
          onChange={(v) => setT("showFloatCards", v)} />
        
        <window.TweakToggle
          label="Sticky CTA 표시"
          value={t.showSticky}
          onChange={(v) => setT("showSticky", v)} />
        
      </window.TweakSection>
    </window.TweaksPanel>);

}

/* ============================================================
   APP
   ============================================================ */

function App() {
  const [t, setT] = window.useTweaks(TWEAK_DEFAULTS);
  const c = PALETTES[t.palette] || PALETTES.dawn;

  /* inject CSS vars + headline weight */
  useEffect(() => {
    const r = document.documentElement;
    Object.entries(c).forEach(([k, v]) => r.style.setProperty(`--c-${k}`, v));
    r.style.setProperty("--hw", String(t.headlineWeight));
  }, [c, t.headlineWeight]);

  return (
    <>
      <Nav c={c} />
      <Hero c={c} t={t} />
      <PainPoints c={c} />
      <Differentiators c={c} />
      <Programs c={c} />
      <HowItWorks c={c} />
      <Instructor c={c} />
      <Testimonials c={c} />
      <FAQ c={c} />
      <Pricing c={c} />
      <Apply c={c} />
      <Footer c={c} />
      <StickyCTA c={c} show={t.showSticky} />
      <Tweaks t={t} setT={setT} />
    </>);

}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { Nav } from '../components/Nav';
import { survivors } from '../src/data/survivors';
import { theology } from '../src/data/theology';
import { institutions } from '../src/data/institutions';
import { recommendations } from '../src/data/recommendations';
import { statistics } from '../src/data/stats';
import { districts } from '../src/data/districts';

type ModalState =
  | { type: 'survivor'; id: string }
  | { type: 'theology'; id: string }
  | { type: 'failure'; id: string }
  | null;

export default function RapeGangInquirySite() {
  const [activeSection, setActiveSection] = useState('overview');
  const [modalState, setModalState] = useState<ModalState>(null);

  // Scrollspy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id) setActiveSection(id);
          }
        });
      },
      { rootMargin: '-120px 0px -40% 0px', threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const openSurvivor = (id: string) => setModalState({ type: 'survivor', id });
  const openTheology = (id: string) => setModalState({ type: 'theology', id });
  const openFailure = (id: string) => setModalState({ type: 'failure', id });
  const closeModal = () => setModalState(null);

  // Find current modal content
  const currentSurvivor = modalState?.type === 'survivor'
    ? survivors.find((s) => s.id === modalState.id)
    : null;
  const currentTheology = modalState?.type === 'theology'
    ? theology.find((t) => t.id === modalState.id)
    : null;
  const currentFailure = modalState?.type === 'failure'
    ? institutions.find((i) => i.id === modalState.id)
    : null;

  // Serious, minimal UK map. Clickable regions update a clear info panel below (no alerts).
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const regionInfo: Record<string, string> = {
    YORKSHIRE: 'Yorkshire & Humber — heavily affected (Rotherham, Bradford, Huddersfield, Leeds, Sheffield and surrounding districts).',
    'GTR MANCHESTER': 'Greater Manchester & Lancashire — Rochdale, Tameside, Oldham, Bolton, Blackburn and many others.',
    'WEST MIDS': 'West Midlands — Birmingham, Telford, Walsall, Wolverhampton, Coventry area.',
    LONDON: 'London — major under-reported epicentre with widespread activity across multiple boroughs.'
  };

  const UKMap = () => (
    <div className="my-6">
      <svg viewBox="0 0 620 720" className="w-full max-w-[620px] mx-auto" role="img" aria-labelledby="map-title" aria-describedby="map-desc">
        <title id="map-title">Map of United Kingdom — 149 local authority districts affected</title>
        <desc id="map-desc">Stylized outline highlighting concentrations in Yorkshire, Greater Manchester, West Midlands, and London. Click region labels for details.</desc>
        <rect x="0" y="0" width="620" height="720" fill="#0f0f0f" rx="4" />
        {/* Simplified UK outline */}
        <path d="M300 40 Q340 80 310 160 Q280 220 320 280 Q300 340 340 400 Q310 480 290 560 Q260 620 280 680" fill="none" stroke="#3f3f3f" strokeWidth="18" strokeLinecap="round" />
        <path d="M220 120 Q260 160 240 240 Q210 300 250 380 Q230 450 210 520 Q190 580 220 650" fill="none" stroke="#3f3f3f" strokeWidth="14" />
        <path d="M280 300 Q240 340 260 420 Q290 480 260 550" fill="none" stroke="#3f3f3f" strokeWidth="10" />
        <circle cx="170" cy="280" r="22" fill="#1f1f1f" stroke="#3f3f3f" />
        {/* Highlighted high-density regions */}
        <g fill="#7f1d1d" opacity="0.75">
          <circle cx="310" cy="280" r="18" />
          <circle cx="270" cy="310" r="14" />
          <circle cx="290" cy="390" r="15" />
          <circle cx="340" cy="480" r="16" />
          <circle cx="260" cy="370" r="10" />
          <circle cx="295" cy="260" r="12" />
        </g>
        {/* Accessible clickable region labels (buttons in SVG) */}
        <g className="cursor-pointer" onClick={() => setSelectedRegion('YORKSHIRE')}>
          <text x="310" y="260" fill="#f5f5f4" fontSize="10" className="ui-label">YORKSHIRE</text>
        </g>
        <g className="cursor-pointer" onClick={() => setSelectedRegion('GTR MANCHESTER')}>
          <text x="265" y="295" fill="#f5f5f4" fontSize="9" className="ui-label">GTR MANCHESTER</text>
        </g>
        <g className="cursor-pointer" onClick={() => setSelectedRegion('WEST MIDS')}>
          <text x="285" y="375" fill="#f5f5f4" fontSize="9" className="ui-label">WEST MIDS</text>
        </g>
        <g className="cursor-pointer" onClick={() => setSelectedRegion('LONDON')}>
          <text x="345" y="460" fill="#f5f5f4" fontSize="9" className="ui-label">LONDON</text>
        </g>
      </svg>

      {selectedRegion && (
        <div className="mt-2 p-3 border border-[#262626] bg-[#111] text-sm" role="status">
          <strong className="ui-label">{selectedRegion}:</strong> {regionInfo[selectedRegion]}
        </div>
      )}

      <p className="text-center text-xs text-[#a3a3a3] mt-2 ui-label">149 local authority districts (Appendix IV). Red markers show major documented concentrations. Click labels for details. Full filterable list below.</p>
    </div>
  );

  // Conviction bar (Quilliam 264)
  const ConvictionBar = () => (
    <div className="my-4 max-w-md">
      <div className="flex items-end gap-3 h-8">
        <div className="flex-1 bg-[#7f1d1d]" style={{ width: '84%' }} title="84% South Asian" />
        <div className="flex-1 bg-[#3f3f3f]" style={{ width: '7%' }} title="7% White" />
        <div className="flex-1 bg-[#3f3f3f]" style={{ width: '8%' }} title="8% Black" />
      </div>
      <div className="flex justify-between text-xs mt-1.5 text-[#c9c9c9] ui-label font-medium">
        <div>84% South Asian (222)</div>
        <div>7% White</div>
        <div>8% Black</div>
      </div>
      <p className="text-xs text-[#a3a3a3] mt-2">Quilliam Foundation analysis of 264 group-based CSE convictions (2005–2017). Vast majority of the South Asian cohort were Pakistani Muslim men.</p>
    </div>
  );

  // Vote split bar (364–111)
  const VoteBar = () => (
    <div className="my-4">
      <div className="flex h-6 rounded overflow-hidden border border-[#262626]">
        <div className="bg-[#7f1d1d] flex items-center justify-center text-[10px] ui-label" style={{ width: `${(364 / (364 + 111)) * 100}%` }}>
          364
        </div>
        <div className="bg-[#3f3f3f] flex items-center justify-center text-[10px] ui-label" style={{ width: `${(111 / (364 + 111)) * 100}%` }}>
          111
        </div>
      </div>
      <div className="flex justify-between text-xs mt-1.5 text-[#c9c9c9] ui-label font-medium">
        <div>Against (Labour-led vote)</div>
        <div>For the inquiry</div>
      </div>
      <p className="text-xs text-[#a3a3a3] mt-1">January 2025 Commons vote on Conservative amendment. The government later ordered a narrower inquiry whose terms of reference were criticised for excluding the demographic, cultural and religious drivers.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f4]">
      <Nav activeSection={activeSection} />

      {/* HERO / LANDING */}
      <header id="top" className="border-b border-[#262626]">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-14">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter">The Rape Gang Inquiry</h1>
            <p className="mt-4 text-xl text-[#a3a3a3]">
              An independent, survivor-led inquiry into organised child sexual exploitation in the United Kingdom
            </p>
            <p className="mt-3 text-sm ui-label text-[#a3a3a3]">Chaired by Rupert Lowe MP · Led by Sammy Woodhouse</p>

            <div className="mt-8 max-w-2xl text-[15px] leading-relaxed text-[#d1d1d1]">
              The Rape Gang Inquiry examined the systematic targeting of vulnerable girls, overwhelmingly White British, by predominantly Muslim Pakistani gangs across towns and cities throughout the United Kingdom. The evidence confirms that this scandal constitutes one of the most horrendous failures in the history of the country.
            </div>

            {/* Stark statistics */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border border-[#262626] p-6">
                <div className="stat">250,000</div>
                <div className="mt-1 text-sm text-[#a3a3a3] ui-label">Minimum estimated victims</div>
                <div className="mt-2 text-xs text-[#a3a3a3]">Lord Pearson (House of Lords, 14 May 2019), extrapolated from the Jay Report on Rotherham, the Telford Inquiry, and the confirmed national footprint across 149 districts. The true number is probably higher.</div>
              </div>
              <div className="border border-[#262626] p-6">
                <div className="stat">149</div>
                <div className="mt-1 text-sm text-[#a3a3a3] ui-label">Local authority districts affected</div>
                <div className="mt-2 text-xs text-[#a3a3a3]">Close to 40% of all such districts across the United Kingdom. The same patterns repeated from Aberdeen to the south coast and in London.</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* OVERVIEW */}
        <section id="overview" className="max-w-5xl mx-auto px-6 pt-16 pb-14 border-b border-[#262626] scroll-mt-20">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">Overview</h2>
          <div className="prose max-w-3xl">
            <p>The Rape Gang Inquiry was established to examine one of the most horrendous scandals in the long history of our country: the systematic targeting of vulnerable girls, overwhelmingly White British, by predominantly Muslim Pakistani gangs across towns and cities up and down the nation.</p>
            <p>The Inquiry was survivor-led. Sammy Woodhouse, a survivor-turned-activist, led the effort alongside Rupert Lowe MP as chair. The panel included MPs Esther McVey, Nick Timothy and Carla Lockhart. Every witness who volunteered testimony — survivors, parents, whistleblowers, politicians and experts — showed courage that made this record possible.</p>
            <p>The 250,000 figure originates directly from a statement in the House of Lords by Lord Pearson of Rannoch on 14 May 2019: “Do the Government accept that if we extrapolate nationally the Jay report on Rotherham and other reports from Telford and Oxford, there appear to have been upwards of 250,000 young white girls raped in this century, very largely by Muslim men, usually several times a day for years?” He added that this number “is probably an underestimate.”</p>
          </div>

          <div className="mt-10">
            <h3 className="font-semibold mb-3 ui-label text-sm tracking-widest">149 DISTRICTS — MAP</h3>
            <UKMap />
            <div className="mt-4 text-sm">
              <input
                type="text"
                placeholder="Filter districts (e.g. Rotherham, London, Birmingham)..."
                className="w-full max-w-md bg-transparent border border-[#262626] px-3 py-2 text-sm placeholder:text-[#666] focus:outline focus:outline-1 focus:outline-[#7f1d1d]"
                onChange={(e) => {
                  const val = e.target.value.toLowerCase();
                  const list = document.getElementById('district-list');
                  if (!list) return;
                  Array.from(list.children).forEach((el) => {
                    const txt = (el.textContent || '').toLowerCase();
                    (el as HTMLElement).style.display = txt.includes(val) ? '' : 'none';
                  });
                }}
              />
              <div id="district-list" className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1 text-sm max-h-[260px] overflow-auto pr-2 border-l border-[#262626] pl-3">
                {districts.map((d, i) => (
                  <div key={i} className="text-[#c9c9c9] hover:text-[#f5f5f4] cursor-default">{d}</div>
                ))}
              </div>
              <p className="text-xs text-[#a3a3a3] mt-2">Full list from Appendix IV. 149 districts confirmed by the Inquiry. The map above highlights major documented concentrations.</p>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-semibold mb-1">87% Muslim names</div>
              <div className="text-[#a3a3a3]">Among those convicted in group-based CSE cases (court records and independent analyses). Dr Taj Hargey (Oxford imam) estimates the true proportion of gang members who are Muslim at ~95%.</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Quilliam 264 convictions (2005-2017)</div>
              <ConvictionBar />
            </div>
            <div>
              <div className="font-semibold mb-1">Population contrast</div>
              <div className="text-[#a3a3a3]">Muslims ≈ 6.5% of the UK population; Pakistanis ≈ 2.1%. The over-representation in these organised networks is extreme and consistent across dozens of towns and cities.</div>
            </div>
          </div>
        </section>

        {/* THE CRIMES */}
        <section id="the-crimes" className="max-w-5xl mx-auto px-6 pt-16 pb-14 border-b border-[#262626] scroll-mt-20">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">The Crimes</h2>
          <div className="prose max-w-3xl">
            <p>Rape gangs operated on an industrial scale using a repeatable method that was documented in every major inquiry and in the testimony heard by this Inquiry.</p>
          </div>

          <div className="mt-8 space-y-6 max-w-3xl">
            {[
              "Girls as young as 11 were befriended by a young Muslim man who treated the child like an adult and began supplying alcohol, drugs and cigarettes.",
              "After a few months the girls were collected from school gates, care homes and streets in taxis and taken to houses, flats, restaurants and hotels.",
              "They were raped repeatedly by groups of men, tortured, filmed for blackmail, and told they were 'white trash' or 'kuffar' who merited punishment.",
              "Many became pregnant while still children. Some miscarried under trauma; others endured coerced abortions or backstreet abortions; some gave birth to children later removed by the state.",
              "The same girls were trafficked between towns and cities, passed between multiple adult men, and in many cases forced into Islamic 'marriage' or conversion as a further instrument of control.",
              "Taxis formed the central logistical backbone. Drivers collected, transported, and returned victims. Some women in the community acted as recruiters or facilitators in exchange for gifts or money."
            ].map((step, idx) => (
              <div key={idx} className="step flex text-[15px] leading-relaxed">
                <span className="mt-0.5 text-[#7f1d1d] font-mono w-6">{idx + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-[#a3a3a3] max-w-3xl">These tactics were not local aberrations. They were replicated with near-identical patterns in at least 149 districts. The perpetrators bore primary responsibility; the institutions that enabled them for decades share the shame.</p>
        </section>

        {/* SURVIVOR TESTIMONY — CORE */}
        <section id="survivor-testimony" className="max-w-6xl mx-auto px-6 pt-16 pb-14 border-b border-[#262626] scroll-mt-20">
          <h2 className="text-3xl font-semibold tracking-tight mb-3">Survivor Testimony</h2>
          <p className="text-[#a3a3a3] max-w-3xl mb-8">This is the heart of the record. Each card opens the full testimony given to the Inquiry. These accounts are presented verbatim and without euphemism.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {survivors.map((s) => (
              <div key={s.id} className="card p-5 bg-[#111] flex flex-col">
                <div className="font-semibold text-lg">{s.name}</div>
                <div className="mt-2 text-sm text-[#c9c9c9] flex-1 line-clamp-4">{s.summary}</div>
                <button
                  onClick={() => openSurvivor(s.id)}
                  className="mt-4 self-start text-sm border border-[#262626] px-3 py-1.5 rounded hover:bg-[#1a1a1a] focus:outline focus:outline-2 focus:outline-[#7f1d1d] ui-label"
                >
                  Read testimony
                </button>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-[#a3a3a3]">All names are pseudonyms as used in the report. Direct pull-quotes highlighted by the Inquiry itself are rendered in the modals as blockquotes with the accent border.</p>
        </section>

        {/* DEMOGRAPHICS & CULTURE */}
        <section id="demographics-culture" className="max-w-5xl mx-auto px-6 pt-16 pb-14 border-b border-[#262626] scroll-mt-20">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">Demographics &amp; Culture</h2>
          <div className="prose max-w-3xl">
            <p>Perpetrators from Pakistani Muslim and other Muslim backgrounds operated under an honour- and shame-based clan code that treated non-Muslim girls, especially white working-class girls, as property available for sexual use.</p>
            <p>Dr. Ella Hill, a Rotherham survivor and now a qualified doctor, has described the religious framing she experienced: the foot-kissing rituals, the language of moral superiority, the view that non-Muslims who eat pork or use cutlery are “unclean” and “dirty.”</p>
            <p>Non-Muslim Asian communities (Sikh, Hindu) were never prevented from organising collectively to protect their own daughters. White British girls had no such protection.</p>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-2">Conviction data (Quilliam 2005–2017)</h3>
            <ConvictionBar />
          </div>

          <div className="mt-8 prose max-w-3xl text-sm">
            <p><strong>The “Asian” labelling critique:</strong> Official narratives frequently used the catch-all “Asian” while the data showed the overwhelming majority of perpetrators in these organised group-based cases were Pakistani Muslim men. Non-Muslim Asian populations (Indian, Chinese, etc.) were not over-represented in the same way.</p>
            <p><strong>International parallels:</strong> The Netherlands “lover boys” phenomenon, a 2021 Swedish academic study showing marked over-representation of men born in the Middle East and North Africa among rape offenders, and the 2002 Australian case of nine Lebanese Muslim men convicted of gang-raping white girls (police aware of over 60 victims linked to the group) all show the same pattern when mass migration from certain cultural and religious backgrounds occurs without honest examination of the consequences.</p>
          </div>
        </section>

        {/* THE INFLUENCE OF ISLAM */}
        <section id="influence-of-islam" className="max-w-5xl mx-auto px-6 pt-14 pb-12 border-b border-[#262626] scroll-mt-20">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">The Influence of Islam</h2>
          <p className="max-w-3xl text-[#a3a3a3] mb-6">The Inquiry heard evidence that eight theological and legal aspects of Islam, filtered through clannish immigrant sub-cultures, provided religious justification that enabled the systematic rape of White British girls. These are presented as the report’s argument, with the Quranic citations rendered exactly as quoted in the source.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {theology.map((t) => (
              <button
                key={t.id}
                onClick={() => openTheology(t.id)}
                className="card text-left p-5 bg-[#111] hover:border-[#3f3f3f] focus:outline focus:outline-2 focus:outline-[#7f1d1d]"
              >
                <div className="font-semibold">{t.title}</div>
                <div className="mt-2 text-sm text-[#c9c9c9] line-clamp-3">{t.claim}</div>
                <div className="mt-3 text-xs text-[#7f1d1d] ui-label">READ THE REPORT’S ANALYSIS →</div>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-[#a3a3a3]">Each factor opens the full claim, the cited Quranic and hadith sources, and the Inquiry’s application to the grooming gang context.</p>
        </section>

        {/* INSTITUTIONAL FAILURES */}
        <section id="institutional-failures" className="max-w-5xl mx-auto px-6 pt-14 pb-12 border-b border-[#262626] scroll-mt-20">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">Institutional Failures</h2>
          <div className="prose max-w-3xl mb-8">
            <p>Every institution that existed to protect children instead enabled the gangs. Police forces, social services, the NHS, schools, taxi licensing authorities, media organisations and the courts all failed — often catastrophically and for years.</p>
          </div>

          <div className="space-y-10">
            {institutions.map((inst) => (
              <div key={inst.id}>
                <h3 className="font-semibold text-lg mb-2">{inst.name}</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {inst.failures.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                {['police', 'social-care'].includes(inst.id) && (
                  <button onClick={() => openFailure(inst.id)} className="mt-3 text-xs border border-[#262626] px-3 py-1 rounded hover:bg-[#1a1a1a] focus:outline focus:outline-2 focus:outline-[#7f1d1d] ui-label">
                    VIEW NAMED INCIDENT
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* POLITICAL FAILURE */}
        <section id="political-failure" className="max-w-5xl mx-auto px-6 pt-14 pb-12 border-b border-[#262626] scroll-mt-20">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">Political Failure</h2>

          <div className="prose max-w-3xl">
            <p>Political failure lies at the heart of the scandal. Successive governments lacked the will to confront the ethnic and religious patterns.</p>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Labour</h3>
              <div className="text-sm space-y-3 text-[#d1d1d1]">
                <p>In January 2025, Labour MPs voted en masse against a Conservative amendment calling for a national statutory inquiry into grooming gangs. The amendment was defeated by 364 votes to 111.</p>
                <VoteBar />
                <p>Sadiq Khan, Mayor of London, repeatedly insisted there were no grooming gangs operating in the capital despite Metropolitan Police reports and whistleblower evidence to the contrary. He described such evidence as “malicious and politically motivated.”</p>
                <p>Jess Phillips MP, appointed Safeguarding Minister, faced resignations from survivors on her victim panel who condemned the process as a sham. The government’s subsequent inquiry under Baroness Anne Longfield had terms of reference widely criticised for deliberately excluding the national scale and the ethnoreligious drivers.</p>
                <p>Lord Nazir Ahmed (former Labour peer and Rotherham councillor) was convicted in 2022 of multiple child sex offences including rape of a 13-year-old girl. The former Labour councillor Liron Velleman pleaded guilty to sex offences against a child. Former Labour MP Ivor Caplin was arrested for grooming a 15-year-old in 2025.</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Conservative &amp; Scotland</h3>
              <div className="text-sm space-y-3 text-[#d1d1d1]">
                <p>The Conservative Party, while in national government from 2010, did not impose mandatory ethnicity recording for CSE offenders and did not launch a nationwide statutory inquiry despite the Rotherham Jay Report and other revelations.</p>
                <p>Rory Stewart, a former Conservative minister, publicly described the phenomenon as “a small problem confined to the north of England.”</p>
                <p>Scottish political parties refused a dedicated inquiry and failed to record offender ethnicity. In February 2026 they were reported to have caved on the issue after sustained pressure.</p>
                <p>Sammy Woodhouse met David Cameron in 2015 and told him the full picture, including that many child victims were still being criminalised. There was no meaningful follow-through.</p>
              </div>
            </div>
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        <section id="recommendations" className="max-w-5xl mx-auto px-6 pt-14 pb-16 scroll-mt-20">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">Recommendations</h2>
          <div className="prose max-w-3xl mb-8">
            <p>The evidence now demands immediate and decisive action. The Inquiry’s recommendations are grouped below exactly as framed in the report’s Recommendations and Legislative Response sections.</p>
          </div>

          {recommendations.map((group, idx) => (
            <div key={idx} className="mb-10">
              <h3 className="font-semibold mb-3 text-lg">{group.category}</h3>
              <ul className="space-y-2 text-sm">
                {group.items.map((item, i) => (
                  <li key={i} className="pl-4 border-l-2 border-[#7f1d1d]">{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-8 p-6 border border-[#262626] bg-[#111] text-sm">
            <p className="font-semibold mb-2">The Childhood Sexual Exploitation Act — core principles (verbatim)</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Children can never consent. The Act must prohibit any agency or court from treating a child’s previous behaviour, clothing, intoxication or “lifestyle choices” as mitigation or consent.</li>
              <li>Accountability encourages competence. Public bodies must face clear legal accountability where serious neglect occurs.</li>
              <li>Sammy’s Law: the Act must expunge the criminal records of any child or young person convicted of crimes (including prostitution, drug possession, or public order offences) that occurred while and because they were forced to do so.</li>
              <li>Proven rapists forfeit their parental rights over any children born of such rape.</li>
              <li>Sharia marriage ban: the Act must prohibit sharia marriages, which have served as a pretext for abusers to exercise greater coercive control.</li>
            </ol>
            <p className="mt-4 text-[#a3a3a3]">The report also records calls, including from Rupert Lowe MP, for a referendum on reintroducing the death penalty for the most heinous crimes where rape gangs are concerned.</p>
          </div>
        </section>
      </main>

      {/* Footer note */}
      <footer className="border-t border-[#262626] py-8 text-xs text-[#a3a3a3] px-6">
        <div className="max-w-5xl mx-auto">
          This site presents the Rape Gang Inquiry report verbatim in structure, statistics, testimony and recommendations. It is a static archival record. No user content, no commercial features, no imagery of children or survivors.
        </div>
      </footer>

      {/* MODALS */}
      <Modal
        open={!!currentSurvivor}
        onClose={closeModal}
        title={currentSurvivor ? `Testimony — ${currentSurvivor.name}` : ''}
        contentWarning="This testimony describes rape, trafficking, torture, and child abuse."
      >
        {currentSurvivor && (
          <>
            {currentSurvivor.quotes.length > 0 && (
              <div className="mb-6">
                {currentSurvivor.quotes.map((q, i) => (
                  <blockquote key={i} className="prose border-l-4 border-[#7f1d1d] pl-5 text-lg italic mb-4">“{q}”</blockquote>
                ))}
              </div>
            )}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const body = (e.currentTarget.closest('.modal-content') as HTMLElement)?.querySelector('.overflow-y-auto');
                body?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs ui-label text-[#7f1d1d] hover:text-[#f5f5f4] mb-2 inline-block"
            >
              ↑ Scroll to top of testimony
            </a>
            <div className="whitespace-pre-line leading-relaxed">
              {currentSurvivor.fullTestimony}
            </div>
          </>
        )}
      </Modal>

      <Modal
        open={!!currentTheology}
        onClose={closeModal}
        title={currentTheology ? currentTheology.title : ''}
      >
        {currentTheology && (
          <div className="space-y-6">
            <div>{currentTheology.claim}</div>
            <div>
              <div className="font-semibold mb-2 ui-label text-sm">Quranic &amp; source citations (as stated in the report)</div>
              <ul className="space-y-3">
                {currentTheology.citations.map((c, i) => (
                  <li key={i} className="pl-4 border-l-2 border-[#7f1d1d] text-sm">{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-2 ui-label text-sm">Application to the grooming gang context</div>
              <p>{currentTheology.application}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!currentFailure}
        onClose={closeModal}
        title={currentFailure ? `${currentFailure.name} — Named Incidents` : ''}
        contentWarning="This section contains documented institutional failures involving named children and specific acts of negligence or complicity."
      >
        {currentFailure && (
          <div className="space-y-4 text-sm">
            {currentFailure.failures
              .filter((f) => f.includes('Hassan') || f.includes('Tameside') || f.includes('toot') || f.includes('missing or destroyed'))
              .map((f, i) => <p key={i} className="border-l-2 border-[#7f1d1d] pl-4">{f}</p>)}
            <p className="text-[#a3a3a3]">These are direct excerpts and summaries from Appendix III and the main body of the report. Full named cases and forces are listed in the source.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

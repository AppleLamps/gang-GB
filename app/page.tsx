"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { Nav } from '../components/Nav';
import { UKMap } from '../components/UKMap';
import { ConvictionBar, VoteBar } from '../components/DataBars';
import { survivors } from '../src/data/survivors';
import { theology } from '../src/data/theology';
import { institutions } from '../src/data/institutions';
import { recommendations } from '../src/data/recommendations';
import { districts } from '../src/data/districts';

type ModalState =
  | { type: 'survivor'; id: string }
  | { type: 'theology'; id: string }
  | { type: 'failure'; id: string }
  | null;

const crimeSteps = [
  "Girls as young as 11 were befriended by a young Muslim man who treated the child like an adult and began supplying alcohol, drugs and cigarettes.",
  "After a few months the girls were collected from school gates, care homes and streets in taxis and taken to houses, flats, restaurants and hotels.",
  "They were raped repeatedly by groups of men, tortured, filmed for blackmail, and told they were 'white trash' or 'kuffar' who merited punishment.",
  "Many became pregnant while still children. Some miscarried under trauma; others endured coerced abortions or backstreet abortions; some gave birth to children later removed by the state.",
  "The same girls were trafficked between towns and cities, passed between multiple adult men, and in many cases forced into Islamic 'marriage' or conversion as a further instrument of control.",
  "Taxis formed the central logistical backbone. Drivers collected, transported, and returned victims. Some women in the community acted as recruiters or facilitators in exchange for gifts or money."
];

export default function RapeGangInquirySite() {
  const [activeSection, setActiveSection] = useState('overview');
  const [modalState, setModalState] = useState<ModalState>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

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

  const currentSurvivor = modalState?.type === 'survivor'
    ? survivors.find((s) => s.id === modalState.id)
    : null;
  const currentTheology = modalState?.type === 'theology'
    ? theology.find((t) => t.id === modalState.id)
    : null;
  const currentFailure = modalState?.type === 'failure'
    ? institutions.find((i) => i.id === modalState.id)
    : null;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Nav activeSection={activeSection} />

      {/* Hero */}
      <header id="top" className="hero">
        <div className="max-w-[var(--page-max)] mx-auto px-5 sm:px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
          <div className="max-w-3xl">
            <p className="section-eyebrow">Independent Inquiry · United Kingdom</p>
            <h1 className="hero-title">The Rape Gang Inquiry</h1>
            <p className="hero-subtitle">
              An independent, survivor-led inquiry into organised child sexual exploitation in the United Kingdom
            </p>
            <p className="hero-meta">Chaired by Rupert Lowe MP · Led by Sammy Woodhouse</p>

            <p className="hero-intro">
              The Rape Gang Inquiry examined the systematic targeting of vulnerable girls, overwhelmingly White British, by predominantly Muslim Pakistani gangs across towns and cities throughout the United Kingdom. The evidence confirms that this scandal constitutes one of the most horrendous failures in the history of the country.
            </p>

            <div className="stat-grid">
              <div className="stat-block">
                <div className="stat">250,000</div>
                <div className="stat-label ui-label">Minimum estimated victims</div>
                <p className="stat-note">
                  Lord Pearson (House of Lords, 14 May 2019), extrapolated from the Jay Report on Rotherham, the Telford Inquiry, and the confirmed national footprint across 149 districts. The true number is probably higher.
                </p>
              </div>
              <div className="stat-block">
                <div className="stat">149</div>
                <div className="stat-label ui-label">Local authority districts affected</div>
                <p className="stat-note">
                  Close to 40% of all such districts across the United Kingdom. The same patterns repeated from Aberdeen to the south coast and in London.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* Overview */}
        <section id="overview" className="page-section max-w-[var(--page-max)] mx-auto px-5 sm:px-6 scroll-mt-20">
          <div className="section-header">
            <span className="section-eyebrow">Section I</span>
            <h2 className="section-title">Overview</h2>
          </div>
          <div className="prose max-w-[var(--content-max)]">
            <p>The Rape Gang Inquiry was established to examine one of the most horrendous scandals in the long history of our country: the systematic targeting of vulnerable girls, overwhelmingly White British, by predominantly Muslim Pakistani gangs across towns and cities up and down the nation.</p>
            <p>The Inquiry was survivor-led. Sammy Woodhouse, a survivor-turned-activist, led the effort alongside Rupert Lowe MP as chair. The panel included MPs Esther McVey, Nick Timothy and Carla Lockhart. Every witness who volunteered testimony — survivors, parents, whistleblowers, politicians and experts — showed courage that made this record possible.</p>
            <p>The 250,000 figure originates directly from a statement in the House of Lords by Lord Pearson of Rannoch on 14 May 2019: &ldquo;Do the Government accept that if we extrapolate nationally the Jay report on Rotherham and other reports from Telford and Oxford, there appear to have been upwards of 250,000 young white girls raped in this century, very largely by Muslim men, usually several times a day for years?&rdquo; He added that this number &ldquo;is probably an underestimate.&rdquo;</p>
          </div>

          <div className="mt-12">
            <h3 className="ui-label text-xs tracking-widest text-[var(--text-faint)] mb-4">149 DISTRICTS — MAP</h3>
            <UKMap selectedRegion={selectedRegion} onSelectRegion={setSelectedRegion} />
            <div className="mt-6">
              <input
                type="text"
                placeholder="Filter the 149 districts…"
                className="input-field"
                aria-label="Filter districts"
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
              <div id="district-list" className="district-list">
                {districts.map((d, i) => (
                  <div key={i} className="district-item">{d}</div>
                ))}
              </div>
              <p className="text-sm text-[var(--text-faint)] mt-3">Full list from Appendix IV. 149 districts confirmed by the Inquiry.</p>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-2">87% Muslim names</h3>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">Among those convicted in group-based CSE cases (court records and independent analyses). Dr Taj Hargey (Oxford imam) estimates the true proportion of gang members who are Muslim at ~95%.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-2">Quilliam 264 convictions (2005–2017)</h3>
              <ConvictionBar />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-2">Population contrast</h3>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">Muslims ≈ 6.5% of the UK population; Pakistanis ≈ 2.1%. The over-representation in these organised networks is extreme and consistent across dozens of towns and cities.</p>
            </div>
          </div>
        </section>

        {/* The Crimes */}
        <section id="the-crimes" className="page-section max-w-[var(--page-max)] mx-auto px-5 sm:px-6 scroll-mt-20">
          <div className="section-header">
            <span className="section-eyebrow">Section II</span>
            <h2 className="section-title">The Crimes</h2>
          </div>
          <div className="prose max-w-[var(--content-max)]">
            <p>Rape gangs operated on an industrial scale using a repeatable method that was documented in every major inquiry and in the testimony heard by this Inquiry.</p>
          </div>

          <div className="timeline mt-8">
            {crimeSteps.map((step, idx) => (
              <div key={idx} className="timeline-item">
                <span className="timeline-number">{idx + 1}</span>
                <span className="timeline-text">{step}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[var(--text-muted)] max-w-[var(--content-max)] leading-relaxed">
            These tactics were not local aberrations. They were replicated with near-identical patterns in at least 149 districts. The perpetrators bore primary responsibility; the institutions that enabled them for decades share the shame.
          </p>
        </section>

        {/* Survivor Testimony */}
        <section id="survivor-testimony" className="page-section max-w-[var(--page-max)] mx-auto px-5 sm:px-6 scroll-mt-20">
          <div className="section-header">
            <span className="section-eyebrow">Section III</span>
            <h2 className="section-title">Survivor Testimony</h2>
            <p className="section-lead">This is the heart of the record. Each card opens the full testimony given to the Inquiry. These accounts are presented verbatim and without euphemism.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {survivors.map((s) => (
              <div key={s.id} className="testimony-card">
                <div className="testimony-card-name">{s.name}</div>
                <div className="testimony-card-summary">{s.summary}</div>
                <button
                  onClick={() => openSurvivor(s.id)}
                  className="btn btn-accent mt-5 self-start"
                >
                  Read full testimony →
                </button>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-[var(--text-faint)]">All names are pseudonyms as used in the report. Direct pull-quotes highlighted by the Inquiry itself are rendered in the modals as blockquotes with the accent border.</p>
        </section>

        {/* Demographics & Culture */}
        <section id="demographics-culture" className="page-section max-w-[var(--page-max)] mx-auto px-5 sm:px-6 scroll-mt-20">
          <div className="section-header">
            <span className="section-eyebrow">Section IV</span>
            <h2 className="section-title">Demographics &amp; Culture</h2>
          </div>
          <div className="prose max-w-[var(--content-max)]">
            <p>Perpetrators from Pakistani Muslim and other Muslim backgrounds operated under an honour- and shame-based clan code that treated non-Muslim girls, especially white working-class girls, as property available for sexual use.</p>
            <p>Dr. Ella Hill, a Rotherham survivor and now a qualified doctor, has described the religious framing she experienced: the foot-kissing rituals, the language of moral superiority, the view that non-Muslims who eat pork or use cutlery are &ldquo;unclean&rdquo; and &ldquo;dirty.&rdquo;</p>
            <p>Non-Muslim Asian communities (Sikh, Hindu) were never prevented from organising collectively to protect their own daughters. White British girls had no such protection.</p>
          </div>

          <div className="mt-10">
            <h3 className="font-semibold text-[var(--text)] mb-3">Conviction data (Quilliam 2005–2017)</h3>
            <ConvictionBar />
          </div>

          <div className="prose max-w-[var(--content-max)] mt-10">
            <p><strong>The &ldquo;Asian&rdquo; labelling critique:</strong> Official narratives frequently used the catch-all &ldquo;Asian&rdquo; while the data showed the overwhelming majority of perpetrators in these organised group-based cases were Pakistani Muslim men. Non-Muslim Asian populations (Indian, Chinese, etc.) were not over-represented in the same way.</p>
            <p><strong>International parallels:</strong> The Netherlands &ldquo;lover boys&rdquo; phenomenon, a 2021 Swedish academic study showing marked over-representation of men born in the Middle East and North Africa among rape offenders, and the 2002 Australian case of nine Lebanese Muslim men convicted of gang-raping white girls (police aware of over 60 victims linked to the group) all show the same pattern when mass migration from certain cultural and religious backgrounds occurs without honest examination of the consequences.</p>
          </div>
        </section>

        {/* The Influence of Islam */}
        <section id="influence-of-islam" className="page-section max-w-[var(--page-max)] mx-auto px-5 sm:px-6 scroll-mt-20">
          <div className="section-header">
            <span className="section-eyebrow">Section V</span>
            <h2 className="section-title">The Influence of Islam</h2>
            <p className="section-lead">
              The Inquiry heard evidence that eight theological and legal aspects of Islam, filtered through clannish immigrant sub-cultures, provided religious justification that enabled the systematic rape of White British girls.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {theology.map((t) => (
              <button
                key={t.id}
                onClick={() => openTheology(t.id)}
                className="theology-card"
              >
                <div className="font-semibold text-[var(--text)]">{t.title}</div>
                <div className="mt-2 text-sm text-[var(--text-muted)] line-clamp-3 leading-relaxed">{t.claim}</div>
                <div className="theology-card-cta">Read the report&apos;s analysis →</div>
              </button>
            ))}
          </div>
          <p className="mt-5 text-xs text-[var(--text-faint)]">Each factor opens the full claim, the cited Quranic and hadith sources, and the Inquiry&apos;s application to the grooming gang context.</p>
        </section>

        {/* Institutional Failures */}
        <section id="institutional-failures" className="page-section max-w-[var(--page-max)] mx-auto px-5 sm:px-6 scroll-mt-20">
          <div className="section-header">
            <span className="section-eyebrow">Section VI</span>
            <h2 className="section-title">Institutional Failures</h2>
          </div>
          <div className="prose max-w-[var(--content-max)] mb-10">
            <p>Every institution that existed to protect children instead enabled the gangs. Police forces, social services, the NHS, schools, taxi licensing authorities, media organisations and the courts all failed — often catastrophically and for years.</p>
          </div>

          <div className="space-y-10">
            {institutions.map((inst) => (
              <div key={inst.id} className="border-l-2 border-[var(--border)] pl-6">
                <h3 className="font-semibold text-lg text-[var(--text)] mb-3">{inst.name}</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {inst.failures.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                {['police', 'social-care'].includes(inst.id) && (
                  <button onClick={() => openFailure(inst.id)} className="btn mt-4">
                    View named incident
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Political Failure */}
        <section id="political-failure" className="page-section max-w-[var(--page-max)] mx-auto px-5 sm:px-6 scroll-mt-20">
          <div className="section-header">
            <span className="section-eyebrow">Section VII</span>
            <h2 className="section-title">Political Failure</h2>
          </div>
          <div className="prose max-w-[var(--content-max)]">
            <p>Political failure lies at the heart of the scandal. Successive governments lacked the will to confront the ethnic and religious patterns.</p>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border-subtle)]">Labour</h3>
              <div className="text-sm space-y-4 text-[var(--text-secondary)] leading-relaxed">
                <p>In January 2025, Labour MPs voted en masse against a Conservative amendment calling for a national statutory inquiry into grooming gangs. The amendment was defeated by 364 votes to 111.</p>
                <VoteBar />
                <p>Sadiq Khan, Mayor of London, repeatedly insisted there were no grooming gangs operating in the capital despite Metropolitan Police reports and whistleblower evidence to the contrary. He described such evidence as &ldquo;malicious and politically motivated.&rdquo;</p>
                <p>Jess Phillips MP, appointed Safeguarding Minister, faced resignations from survivors on her victim panel who condemned the process as a sham. The government&apos;s subsequent inquiry under Baroness Anne Longfield had terms of reference widely criticised for deliberately excluding the national scale and the ethnoreligious drivers.</p>
                <p>Lord Nazir Ahmed (former Labour peer and Rotherham councillor) was convicted in 2022 of multiple child sex offences including rape of a 13-year-old girl. The former Labour councillor Liron Velleman pleaded guilty to sex offences against a child. Former Labour MP Ivor Caplin was arrested for grooming a 15-year-old in 2025.</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border-subtle)]">Conservative &amp; Scotland</h3>
              <div className="text-sm space-y-4 text-[var(--text-secondary)] leading-relaxed">
                <p>The Conservative Party, while in national government from 2010, did not impose mandatory ethnicity recording for CSE offenders and did not launch a nationwide statutory inquiry despite the Rotherham Jay Report and other revelations.</p>
                <p>Rory Stewart, a former Conservative minister, publicly described the phenomenon as &ldquo;a small problem confined to the north of England.&rdquo;</p>
                <p>Scottish political parties refused a dedicated inquiry and failed to record offender ethnicity. In February 2026 they were reported to have caved on the issue after sustained pressure.</p>
                <p>Sammy Woodhouse met David Cameron in 2015 and told him the full picture, including that many child victims were still being criminalised. There was no meaningful follow-through.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section id="recommendations" className="page-section max-w-[var(--page-max)] mx-auto px-5 sm:px-6 scroll-mt-20 border-b-0">
          <div className="section-header">
            <span className="section-eyebrow">Section VIII</span>
            <h2 className="section-title">Recommendations</h2>
          </div>
          <div className="prose max-w-[var(--content-max)] mb-10">
            <p>The evidence now demands immediate and decisive action. The Inquiry&apos;s recommendations are grouped below exactly as framed in the report&apos;s Recommendations and Legislative Response sections.</p>
          </div>

          {recommendations.map((group, idx) => (
            <div key={idx} className="mb-10">
              <h3 className="font-semibold text-lg text-[var(--text)] mb-4">{group.category}</h3>
              <div className="space-y-1">
                {group.items.map((item, i) => (
                  <div key={i} className="rec-item">{item}</div>
                ))}
              </div>
            </div>
          ))}

          <div className="callout mt-10">
            <p className="font-semibold text-[var(--text)] mb-4">The Childhood Sexual Exploitation Act — core principles (verbatim)</p>
            <ol className="list-decimal pl-5 space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
              <li>Children can never consent. The Act must prohibit any agency or court from treating a child&apos;s previous behaviour, clothing, intoxication or &ldquo;lifestyle choices&rdquo; as mitigation or consent.</li>
              <li>Accountability encourages competence. Public bodies must face clear legal accountability where serious neglect occurs.</li>
              <li>Sammy&apos;s Law: the Act must expunge the criminal records of any child or young person convicted of crimes (including prostitution, drug possession, or public order offences) that occurred while and because they were forced to do so.</li>
              <li>Proven rapists forfeit their parental rights over any children born of such rape.</li>
              <li>Sharia marriage ban: the Act must prohibit sharia marriages, which have served as a pretext for abusers to exercise greater coercive control.</li>
            </ol>
            <p className="mt-5 text-sm text-[var(--text-faint)]">The report also records calls, including from Rupert Lowe MP, for a referendum on reintroducing the death penalty for the most heinous crimes where rape gangs are concerned.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border-subtle)] py-10 px-5 sm:px-6">
        <div className="max-w-[var(--page-max)] mx-auto">
          <p className="text-xs text-[var(--text-faint)] leading-relaxed max-w-2xl">
            This site presents the Rape Gang Inquiry report verbatim in structure, statistics, testimony and recommendations. It is a static archival record. No user content, no commercial features, no imagery of children or survivors.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <Modal
        open={!!currentSurvivor}
        onClose={closeModal}
        title={currentSurvivor ? `Testimony — ${currentSurvivor.name}` : ''}
        contentWarning="This testimony describes rape, trafficking, torture, and child abuse."
      >
        {currentSurvivor && (
          <>
            {currentSurvivor.quotes.length > 0 && (
              <div className="mb-8">
                {currentSurvivor.quotes.map((q, i) => (
                  <blockquote key={i} className="prose border-l-4 border-[var(--accent)] pl-5 text-xl italic mb-5 text-[var(--text)]">&ldquo;{q}&rdquo;</blockquote>
                ))}
              </div>
            )}
            <button
              onClick={() => {
                const body = document.querySelector('.modal-body');
                body?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs ui-label text-[var(--accent)] hover:text-[var(--text)] mb-4 inline-block no-underline bg-transparent border-none cursor-pointer p-0 min-h-0"
            >
              ↑ Scroll to top of testimony
            </button>
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
          <div className="space-y-8">
            <p>{currentTheology.claim}</p>
            <div>
              <div className="font-semibold mb-3 ui-label text-xs tracking-widest text-[var(--text-faint)]">QURANIC &amp; SOURCE CITATIONS</div>
              <ul className="space-y-3">
                {currentTheology.citations.map((c, i) => (
                  <li key={i} className="pl-4 border-l-2 border-[var(--accent-muted)] text-sm leading-relaxed">{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3 ui-label text-xs tracking-widest text-[var(--text-faint)]">APPLICATION TO THE GROOMING GANG CONTEXT</div>
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
              .map((f, i) => <p key={i} className="border-l-2 border-[var(--accent-muted)] pl-4 leading-relaxed">{f}</p>)}
            <p className="text-[var(--text-faint)]">These are direct excerpts and summaries from Appendix III and the main body of the report. Full named cases and forces are listed in the source.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
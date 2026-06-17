#!/usr/bin/env node
/**
 * One-time parser for the Rape Gang Inquiry report.md
 * Extracts structured data for the static site.
 * Run: node scripts/extract-report-data.cjs
 * Then hand-verify the emitted src/data/*.ts against the source md.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, 'report.md'); // clean name at root (also content/report.md)
const OUT_DIR = path.join(ROOT, 'src/data');

if (!fs.existsSync(SOURCE)) {
  console.error('Source report.md not found at project root. Aborting.');
  process.exit(1);
}

const raw = fs.readFileSync(SOURCE, 'utf8');
const lines = raw.split(/\r?\n/);

function ensureOut() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
}

function writeTS(file, content) {
  const fp = path.join(OUT_DIR, file);
  fs.writeFileSync(fp, content, 'utf8');
  console.log('Wrote', path.relative(ROOT, fp));
}

// Simple slug
function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// === STATS (hard-verified constants from source) ===
const stats = [
  { value: "250,000", label: "Minimum estimated victims", source: "Lord Pearson (House of Lords, 14 May 2019) extrapolated from Jay Report (Rotherham) + Telford Inquiry and national footprint across 149 districts." },
  { value: "149", label: "Local authority districts affected", source: "Appendix IV and Overview of Crimes: 'at least 149 Local Authority Districts across the United Kingdom' (close to 40%)." },
  { value: "87%", label: "Convictions with distinctively Muslim names", source: "Peter McLoughlin (Easy Meat) + cross-referenced analyses." },
  { value: "6.5%", label: "UK Muslim population share (census)", source: "Recent census data cited in Demographics and Culture." },
  { value: "84%", label: "South Asian (of 264 group-based CSE convictions 2005-2017)", source: "Quilliam Foundation analysis (222 of 264 offenders)." },
];

// === DISTRICTS (Appendix IV) ===
function extractDistricts() {
  const districts = [];
  let collecting = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (/^##\s*LOCAL AUTHORITY DISTRICTS\s*\[149\]/i.test(l)) {
      collecting = true;
      continue;
    }
    if (collecting) {
      if (/^##\s*COUNTIES/i.test(l)) break;
      if (l && !l.startsWith('#') && !l.startsWith('<') && l.length > 2 && !/^\d/.test(l)) {
        districts.push(l);
      }
    }
  }
  // Fallback / sanity: the report states 149; if we got fewer due to formatting, we still trust the source count.
  return districts;
}

// === SURVIVORS ===
// Boundaries: from VICTIM TESTIMONY until WHISTLEBLOWER / DEMOGRAPHICS
// Then Appendix I entries tagged [SURVIVOR]
function extractSurvivors() {
  const survivors = [];
  let inVictimSection = false;
  let current = null;
  let bodyLines = [];

  const startRe = /^##\s*['"]?([A-Z][A-Za-z'\-\s]+?)['"]?\s*$/;
  const appendixIHeader = /APPENDIX I/i;

  function flush() {
    if (!current) return;
    const full = bodyLines.join('\n').trim();
    // One-line summary: first substantial sentence or first 120 chars
    let summary = full.split(/\n{2,}/)[0] || full.slice(0, 140);
    summary = summary.replace(/\s+/g, ' ').trim().slice(0, 160);
    if (summary.length > 120) summary = summary.slice(0, 117) + '…';

    // Pull highlighted quotes from the report (known + scan for ## Name: patterns)
    const quotes = [];
    const known = {
      'CHLOE': 'Hundreds. Hundreds and hundreds and hundreds.',
      'MICHELLE': '98% of them were Pakistani Muslim. If not, they were Iraqi Muslim or Kurdish.',
    };
    const nameUpper = current.name.toUpperCase();
    if (known[nameUpper]) quotes.push(known[nameUpper]);

    // Scan body for sub ## Name: "quote" blocks (Taylor etc.)
    const quoteRe = /##\s*['"]?([A-Za-z]+)['"]?:?\s*\n+##?\s*["']([^"']{20,})["']/g;
    let m;
    while ((m = quoteRe.exec(full)) !== null) {
      if (m[2] && !quotes.includes(m[2])) quotes.push(m[2].trim());
    }

    survivors.push({
      id: slug(current.name),
      name: current.name,
      summary,
      fullTestimony: full,
      quotes,
    });
    current = null;
    bodyLines = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();

    if (/^##\s*VICTIM TESTIMONY/i.test(t)) {
      inVictimSection = true;
      continue;
    }
    if (/^##\s*(WHISTLEBLOWER|DEMOGRAPHICS)/i.test(t)) {
      flush();
      inVictimSection = false;
      continue;
    }
    if (appendixIHeader.test(t)) {
      flush();
      inVictimSection = true; // continue for Appendix I tagged
      continue;
    }

    const m = startRe.exec(t);
    if (m) {
      const candidate = m[1].trim().replace(/^['"]|['"]$/g, '');
      const isAppendixSurvivor = /APPENDIX I/i.test(lines.slice(Math.max(0, i-3), i+1).join(' ')) || 
        (lines[i+1] || '').includes('[SURVIVOR]') || (lines[i+2] || '').includes('[SURVIVOR]');

      if (inVictimSection && candidate.length > 1 && !/^(CHLOE|FIONA|MICHELLE|WHITNEY|SALLY|MARLON|WALLACE|SEBASTIAN|ANNA|TAYLOR|MARIE|JANE|LEANNE|LILLY|GRACE|VICTORIA|ELEANOR|RACHEL|JEN|KATE|FELICITY|CLAIRE|TINKERBELL|LIA|CELESTE|PHOEBE|JO'JO|ROSS)/i.test(candidate) === false) {
        // Accept main list + known appendix
      }

      // Accept the known set from query + report
      const knownNames = ['CHLOE','FIONA','MICHELLE','WHITNEY','SALLY','MARLON','WALLACE','SEBASTIAN','ANNA','TAYLOR','MARIE','JANE','LEANNE','LILLY','GRACE','VICTORIA','ELEANOR','RACHEL','JEN','KATE','FELICITY','CLAIRE','TINKERBELL','LIA','CELESTE','PHOEBE',"JO'JO"];
      const upper = candidate.toUpperCase().replace(/['"]/g,'');
      if (inVictimSection && knownNames.some(k => upper === k || upper.includes(k))) {
        flush();
        current = { name: candidate };
        bodyLines = [];
        continue;
      }
    }

    if (current && inVictimSection) {
      // Stop body on next major ## that is not a sub quote
      if (/^##\s*(?!(CHLOE|FIONA|MICHELLE|WHITNEY|SALLY|MARLON|WALLACE|SEBASTIAN|ANNA|TAYLOR|MARIE|JANE|LEANNE|LILLY|GRACE|VICTORIA|ELEANOR|RACHEL|JEN|KATE|FELICITY|CLAIRE|TINKERBELL|LIA|CELESTE|PHOEBE|JO'JO|ROSS))/i.test(t) && !t.includes(':')) {
        // likely next section — flush handled by other ifs
      } else {
        bodyLines.push(line);
      }
    }
  }
  flush();

  // Ensure we have the core set; dedupe by id
  const seen = new Set();
  return survivors.filter(s => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
}

// === THEOLOGY (8 factors) ===
function extractTheology() {
  const factors = [
    {
      id: 'muslim-supremacism',
      title: 'Muslim Supremacism',
      claim: 'Islam holds that those who are righteous and truly fear God, meaning Muslims, are inherently superior to those who reject God\'s commands, namely non-Muslims. This idea is captured in Quran 3:110 and reinforced by Sura 48:28, 8:55, 9:28. These teachings can provide a religious justification that bolsters an abuser\'s conviction of their own superiority and facilitates the dehumanisation of non-Muslim victims.',
      citations: [
        'Sura 3:110: "You [Muslims] are the best nation, raised up for humankind, commanding what is good and forbidding what is wrong, and believing in Allah. If only the people of the book [i.e. Christians and Jews] believed, it would be better for them; some among them are believers, but most are perverted."',
        'Sura 48:28: "It is He [Allah] who has sent His Messenger with the guidance and the religion of truth [Islam], to make it triumph over every religion."',
        'Sura 8:55: "Surely the worst of animals in Allah\'s sight are rejectors [of Islam]; they do not believe."',
        'Sura 9:28 labels "associators" as "unclean" (najis).'
      ],
      application: 'In her July 2020 podcast interview, Rotherham survivor Dr. Ella Hill described abusive language and acts that embodied this sense of superiority. She recounted being made to bend down and kiss her perpetrator\'s feet... "It\'s a Muslim superiority thing: they believe they have maximum moral authority to command the people beneath them to lick their feet." Non-Muslim habits were viewed as inherently impure.'
    },
    {
      id: 'us-and-them',
      title: 'Al-wala\' wa-l-bara\' ("Us and Them" Mindset)',
      claim: 'The Islamic principle known as al-walaa\' wa-l-baraa\' (loyalty and disavowal) commands Muslims to direct their love and allegiance towards what pleases God while hating, avoiding, and distancing themselves from what displeases Him. It calls for loving and supporting fellow believers and rejecting non-believers.',
      citations: [
        'Sura 3:28: "Let not the believers take the disbelievers as allies, rather than of believers whoever does that has nothing from God..."',
        'Sura 5:51-52: "You who believe! Do not take the Jews and the Christians as allies. They are allies of each other..."',
        'Sura 60:4: "There was a good example for you in Abraham... We are quit of you and what you serve instead of God. We repudiate you, and between us and you enmity has appeared, and hatred forever, until you believe in God alone."'
      ],
      application: 'This mindset, filtered through clannish immigrant sub-cultures, contributed to the treatment of non-Muslim (especially white working-class) girls as available for sexual use without the protections or respect afforded to in-group women.'
    },
    {
      id: 'male-dominance',
      title: 'Male Dominance over Women',
      claim: 'Islam establishes that men hold the position of managers or maintainers (qawwamun) over women (Sura 4:34). Every woman remains under the guardianship of a male relative. Sura 2:228 declares that men hold a rank above women. Authoritative hadith state that women are deficient in both religion and intelligence.',
      citations: [
        'Sura 4:34 (men as qawwamun, permission to discipline wives including physical violence).',
        'Sura 2:228: "men hold a rank above women".',
        'Hadith: women "deficient in religion and intelligence".'
      ],
      application: 'This theological framing of women as inferior and in need of male control, combined with the view of non-Muslim women as "kuffar" outside moral bounds, enabled systematic exploitation and the use of pregnancy, forced conversion, and sharia "marriage" as instruments of domination.'
    },
    {
      id: 'seclusion-of-women',
      title: 'The Seclusion of Women',
      claim: 'Islamic sources require the seclusion of women (Sura 33:33, 33:59). The al-Hilali "uncovered meat" analogy explicitly places responsibility for male sexual behaviour on women\'s visibility and dress.',
      citations: [
        'Sura 33:33, 33:59 (seclusion and hijab prescriptions).',
        'Noted commentary (al-Hilali and others) comparing uncovered women to "uncovered meat" that attracts predators.'
      ],
      application: 'White British girls who were not veiled or who participated in normal British social life were treated as inherently available and "asking for it" under this imported logic.'
    },
    {
      id: 'forced-marriage-age',
      title: 'Forced Marriage and the Age of Consent',
      claim: 'Under sharia, marriage is a contract between the groom and the bride\'s male guardian. There is no fixed minimum age of consent. The precedent of Aisha (married at 6, consummated at 9) and Sura 65:4 (addressing divorced girls who have not yet menstruated) are cited.',
      citations: [
        'Aisha precedent.',
        'Sura 65:4 (rules for girls who have not reached menstruation).',
        'Nikah as contractual transfer of sexual access.'
      ],
      application: 'This religious permissiveness around child and forced marriage provided cultural and theological cover for the grooming, "marriage", and long-term sexual control of children as young as 11-13.'
    },
    {
      id: 'female-sexuality-fitna',
      title: 'Female Sexuality as Fitna',
      claim: 'Islamic sources portray female sexuality as a powerful and dangerous temptation (fitna). The Prophet is recorded as stating that he had not left any trial more severe to men than women. Female sexuality is to be strictly controlled; FGM is practiced in some communities as a related control mechanism.',
      citations: [
        'Hadith on women as fitna.',
        'Sura 24:30-31 (guarding gaze and modesty).'
      ],
      application: 'Non-Muslim girls, lacking the "protection" of seclusion and hijab, were viewed through this lens as sources of fitna to be exploited rather than persons with rights.'
    },
    {
      id: 'jihad-sex-slavery',
      title: 'Jihad and Sex Slavery',
      claim: 'Islamic sharia authorises the sexual use of non-Muslim captives taken in jihad (Sura 4:24, 23:6, 70:30). Captured women are regarded as lawfully enslaved; sexual relations with them do not constitute zina. Historical precedent includes the Barbary slave trade and modern ISIS practice.',
      citations: [
        'Sura 4:24, 23:6, 70:30 (permission for sexual relations with "those whom your right hands possess").',
        'Classical jurisprudence on war captives and concubinage.'
      ],
      application: 'Survivors were routinely called "white slags", "kuffar", and "white trash" who "merited punishment". The religious framing of non-Muslim females as permissible for sexual use without consent or marriage parallels the historical and doctrinal institution of sex slavery.'
    },
    {
      id: 'dhimmitude',
      title: 'Dhimmitude',
      claim: 'Classical sharia divides the world into dar al-Islam and dar al-harb. Non-Muslims under Islamic authority (dhimmis) are subjugated, pay jizya, and have inferior legal and social status. This creates a permanent hierarchy in which non-Muslims are second-class by religious design.',
      citations: [
        'dar al-Islam / dar al-harb framework.',
        'Jizya and dhimmi regulations in classical fiqh.'
      ],
      application: 'The grooming gangs operated with an implicit (and sometimes explicit) sense that the girls they targeted were of a lower order, outside the protections of the in-group, and fair game in a conquered or colonised space.'
    }
  ];
  return factors;
}

// === INSTITUTIONS (from Appendix III + main text) ===
function extractInstitutions() {
  return [
    {
      id: 'police',
      name: 'Police',
      failures: [
        'Ignored repeated reports from parents and victims.',
        'Criminalised victims (arrested girls for "prostitution", "drunk and disorderly", shoplifting while trafficked).',
        'Returned children to the scene of abuse (documented in multiple forces).',
        'Destroyed or lost evidence and records.',
        'Allowed known rapists to walk free on bail with no enforcement of conditions.',
        'Specific: South Yorkshire Police — PC Hassan Ali alleged to have brokered a "no-prosecution deal" with Arshid Hussain (Hussain handed over a missing underage girl at a petrol station in exchange for no arrest).',
        'Greater Manchester, West Yorkshire, West Midlands, Merseyside, Police Scotland, and Metropolitan Police all named with parallel patterns of inaction, denial, and victim-blaming.'
      ]
    },
    {
      id: 'social-care',
      name: 'Social Care',
      failures: [
        'Placed children in children\'s homes and semi-independent units that became trafficking hubs.',
        'Undermined protective parents and removed parental authority (e.g. Tameside Children\'s Services returned Marlon\'s daughter to the exact farm where she had been raped, destroying forensic evidence).',
        'Closed cases despite clear indicators of exploitation.',
        'Retaliated against whistleblowers.',
        'Staff in children\'s homes handed children to taxi drivers (Lilly testimony: "They would toot the horn of the car and then a child would be taken to the front door [by a staff member]").',
        'Records routinely missing or destroyed (multiple cases, including "key records from [the children\'s home] were missing or destroyed").'
      ]
    },
    {
      id: 'nhs',
      name: 'NHS',
      failures: [
        'Recorded genital injuries, multiple STIs in children as young as 13, pregnancies caused by rape, and suicide attempts.',
        'Discharged victims back to their abusers the same night with no safeguarding referral or trauma care.',
        'Treated symptoms in isolation; failed to connect repeated presentations to organised exploitation.'
      ]
    },
    {
      id: 'schools',
      name: 'Schools',
      failures: [
        'Observed older men collecting girls at the gates.',
        'Heard direct disclosures of rape on school premises.',
        'Responded by excluding the victims rather than protecting them or making referrals.',
        'Treated exploitation as behavioural problems or "lifestyle choices".'
      ]
    },
    {
      id: 'taxi-licensing',
      name: 'Taxi Licensing',
      failures: [
        'Renewed permits for drivers who formed the logistical backbone of the networks.',
        'Collapsed in the face of organised protests when basic safety measures (CCTV, English language tests) were proposed.',
        'Ignored intelligence linking named drivers and firms to organised child sexual exploitation.'
      ]
    },
    {
      id: 'media',
      name: 'Media',
      failures: [
        'For years downplayed or ignored the ethnic and religious patterns.',
        'Framed early reporting as "far-right" or risked inflaming "community tensions".',
        'Only after major inquiries did coverage become sustained.'
      ]
    },
    {
      id: 'courts',
      name: 'Courts',
      failures: [
        'Accepted "cultural background" as de facto mitigation.',
        'Allowed concurrent sentencing for serial, organised, multi-victim rape.',
        'Failed to treat filmed blackmail, trafficking, pregnancy as rape, and racial/religious aggravation as serious aggravating factors in most cases.',
        'Sentences frequently bore no relation to the lifetime harm inflicted.'
      ]
    }
  ];
}

// === RECOMMENDATIONS (grouped from Recommendations + Legislative Response) ===
function extractRecommendations() {
  return [
    {
      category: 'Criminal Justice Response',
      items: [
        'Victims must be placed at the centre of the criminal justice process. They must have the right to be informed of all decisions, to attend sentencing hearings, and to submit victim personal statements that carry statutory weight.',
        'Independent Sexual Violence Advisers must be funded nationally and assigned to every grooming gang victim from the moment of first report.'
      ]
    },
    {
      category: 'Sentencing',
      items: [
        'The Sentencing Council must be required by statute to revise its guidelines so that group-based child sexual exploitation carries a starting point of life imprisonment, with a minimum tariff of 50 years for ringleaders and 25 years for participants.',
        'Racial or religious motivation, multiple victims, trafficking across counties, pregnancy caused by rape, and use of filming or blackmail must each be spelled out as statutory aggravating factors.',
        'Concurrent sentencing must be prohibited where multiple victims are involved; cumulative sentencing must be the default.',
        'A number of politicians, including Rupert Lowe MP, have also called for a referendum on reintroducing the death penalty for the most heinous crimes. There is a case to be made that this is more than proportionate where rape gangs are concerned.'
      ]
    },
    {
      category: 'Immigration, Deportations, and Denaturalisations',
      items: [
        'Every foreign national convicted of group-based CSE must at the very least be deported.',
        'Any British citizen convicted of these offences who holds dual nationality must lose their citizenship automatically upon conviction (retrospective application supported).',
        'Where a perpetrator has family members in Britain who have supported, harboured or failed to report the offending, the entire immediate family unit must also face deportation proceedings unless they prove active cooperation or no prior knowledge.',
        'Mosques, madrassas, and community organisations that have harboured or failed to report perpetrators must face investigation and, if found guilty, be closed.',
        'Immigration policy must immediately reflect the evidence: anyone from a country whose nationals are disproportionately represented in rape gang convictions must no longer be entitled to a visa.'
      ]
    },
    {
      category: 'Overseas Taskforce',
      items: [
        'A dedicated taskforce within the FCDO (working with Home Office, NCA, police) must prioritise the identification, location, safeguarding, and urgent repatriation of British victims trafficked overseas, particularly to Pakistan and other countries.'
      ]
    },
    {
      category: 'Compensation',
      items: [
        'A national compensation scheme for grooming gang victims must be set up at once, funded by a levy on convicted perpetrators\' assets and the defined benefit pensions of public servants found guilty of or dismissed for culpable negligence.',
        'Awards must reflect lifelong harm (education, employment, mental and physical health, family life). The existing CICA scheme has proven unfit (e.g. Sammy Woodhouse refused on grounds of "consent").'
      ]
    },
    {
      category: 'Family',
      items: [
        'The law must place the protective family at the centre of safeguarding. A "family first" approach: families recognised as primary protective factors wherever safe; statutory right for parents to be informed of all risks, receive copies of assessments, and challenge decisions.',
        'Financial and practical assistance, including emergency housing relocation, must be made available to any parent reporting grooming indicators.'
      ]
    },
    {
      category: 'Legislation (Childhood Sexual Exploitation Act)',
      items: [
        'A single, comprehensive Childhood Sexual Exploitation Act must be enacted, creating a specific offence of "organised group-based child sexual exploitation" with mandatory minimum sentences and aggravating factors for racial/religious motivation.',
        'The Act must reverse the presumption that a child can ever consent to sexual activity with an adult in a grooming context.',
        'Mandatory recording and publication of ethnicity, immigration status, nationality, and religion of both victims and perpetrators in all such cases.',
        'Criminalise provably culpable failure or refusal by public officials to act on rape gangs for fear of "community tensions".',
        'The following principles must be enshrined: (1) Children can never consent. (2) Accountability encourages competence (positive duty on public bodies; breach is an offence). (3) Sammy\'s Law — expunge criminal records of children convicted of offences committed while and because they were groomed (no mens rea). (4) Proven rapists forfeit parental rights over children born of rape. (5) Sharia marriage ban — prohibit sharia marriages as they have served as a pretext for coercive control.'
      ]
    },
    {
      category: 'Frontline Reform',
      items: [
        'Every frontline professional (police, social workers, teachers, GPs, taxi licensing, etc.) must receive mandatory annual training on group-based CSE conveying the documented ethnic and religious patterns, tactics, signs of grooming, and legal duty to act.',
        'Failure to act on clear indicators must carry professional risk and, in serious cases, criminal consequences.',
        'A national public awareness campaign must be launched.'
      ]
    }
  ];
}

function main() {
  ensureOut();

  const districts = extractDistricts();
  const survivors = extractSurvivors();
  const theology = extractTheology();
  const institutions = extractInstitutions();
  const recommendations = extractRecommendations();

  writeTS('stats.ts', `export const statistics = ${JSON.stringify(stats, null, 2)} as const;\n`);
  writeTS('districts.ts', `export const districts = ${JSON.stringify(districts, null, 2)} as const;\nexport const districtCount = ${districts.length};\n`);
  writeTS('survivors.ts', `export const survivors = ${JSON.stringify(survivors, null, 2)} as const;\n`);
  writeTS('theology.ts', `export const theology = ${JSON.stringify(theology, null, 2)} as const;\n`);
  writeTS('institutions.ts', `export const institutions = ${JSON.stringify(institutions, null, 2)} as const;\n`);
  writeTS('recommendations.ts', `export const recommendations = ${JSON.stringify(recommendations, null, 2)} as const;\n`);

  console.log('\nExtraction complete. districts.length =', districts.length);
  console.log('survivors.length =', survivors.length);
  console.log('Review src/data/*.ts against the source report.md and patch for fidelity.');
}

main();

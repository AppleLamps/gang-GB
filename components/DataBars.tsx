export function ConvictionBar() {
  return (
    <div className="data-bar">
      <div className="data-bar-track">
        <div className="data-bar-segment data-bar-segment--accent" style={{ width: '84%' }}>84%</div>
        <div className="data-bar-segment data-bar-segment--muted" style={{ width: '7%' }}>7%</div>
        <div className="data-bar-segment data-bar-segment--muted" style={{ width: '9%' }}>8%</div>
      </div>
      <div className="data-bar-legend">
        <span>84% South Asian (222)</span>
        <span>7% White</span>
        <span>8% Black</span>
      </div>
      <p className="data-bar-caption">
        Quilliam Foundation analysis of 264 group-based CSE convictions (2005–2017). Vast majority of the South Asian cohort were Pakistani Muslim men.
      </p>
    </div>
  );
}

export function VoteBar() {
  return (
    <div className="data-bar">
      <div className="data-bar-track">
        <div className="data-bar-segment data-bar-segment--accent" style={{ width: `${(364 / (364 + 111)) * 100}%` }}>364</div>
        <div className="data-bar-segment data-bar-segment--muted" style={{ width: `${(111 / (364 + 111)) * 100}%` }}>111</div>
      </div>
      <div className="data-bar-legend">
        <span>Against (Labour-led vote)</span>
        <span>For the inquiry</span>
      </div>
      <p className="data-bar-caption">
        January 2025 Commons vote on Conservative amendment. The government later ordered a narrower inquiry whose terms of reference were criticised for excluding the demographic, cultural and religious drivers.
      </p>
    </div>
  );
}
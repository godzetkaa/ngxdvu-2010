import { Children, cloneElement, isValidElement, useEffect, useState } from 'react';
import './App.css';

const opening = 'Gửi Bùi Thu Hằng, cô gái anh thương.';
const hearts = Array.from({ length: 22 }, (_, i) => ({ left: `${(i * 47 + 7) % 100}%`, delay: `${-i * 1.7}s`, duration: `${12 + i % 7 * 2}s`, size: `${12 + i % 5 * 7}px` }));

const celebrationHearts = Array.from({ length: 180 }, (_, i) => ({
  left: ((i * 61.803) % 100) + '%', delay: -(i * 1.37 % 24) + 's',
  duration: (12 + i % 13) + 's', size: (12 + i % 8 * 5) + 'px',
  sway: (25 + i % 7 * 15) * (i % 2 ? 1 : -1) + 'px',
  opacity: 0.2 + i % 5 * 0.08,
  color: ['#c94c72', '#e78da3', '#b63d60', '#efb3c1', '#d87090'][i % 5],
}));

// Animate all introductory text while retaining the original semantic markup.
function animateCopy(node, counter = { value: 0 }) {
  if (typeof node === 'string' || typeof node === 'number') {
    const text = String(node).normalize('NFC');
    if (!/[\p{L}\p{N}]/u.test(text)) return node;
    return <span className="flight-copy"><span className="sr-only">{text}</span>{text.split(/(\s+)/).map((word, wordIndex) =>
      /\s+/.test(word) ? word : <span className="flight-word" aria-hidden="true" key={wordIndex}>{Array.from(word).map(char => {
        const i = counter.value++;
        return <span className="flying-letter" key={i} style={{ '--x': Math.sin(i * 4.7) * 42 + 'vw', '--y': Math.cos(i * 2.3) * 40 + 'vh', '--rotation': Math.sin(i * 3.1) * 170 + 'deg', '--float-delay': -(i % 11) * 0.43 + 's' }}>{char}</span>;
      })}</span>
    )}</span>;
  }
  if (!isValidElement(node) || node.props['aria-hidden'] === 'true' || node.props.className === 'letter-section') return node;
  return cloneElement(node, undefined, Children.map(node.props.children, child => animateCopy(child, counter)));
}

function App() {
  const [stage, setStage] = useState('scattered');
  const [run, setRun] = useState(0);
  const [hug, setHug] = useState(0);
  useEffect(() => {
    const gather = setTimeout(() => setStage(s => s === 'scattered' ? 'gathered' : s), 10000);
    const reveal = setTimeout(() => setStage('letter'), 13500);
    return () => { clearTimeout(gather); clearTimeout(reveal); };
  }, [run]);
  const replay = () => { setStage('scattered'); setHug(0); setRun(value => value + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const page = (
    <div className={`love-page stage-${stage}`} key={run}>
      <div className={`floating-hearts ${stage === 'letter' ? 'celebration-hearts' : ''}`} aria-hidden="true">
        {(stage === 'letter' ? celebrationHearts : hearts).map((heart, i) => <span key={i} style={{ left: heart.left, '--delay': heart.delay, '--duration': heart.duration, '--size': heart.size, '--sway': heart.sway, '--heart-opacity': heart.opacity, '--heart-color': heart.color }}>{stage === 'letter' && i % 3 !== 0 ? '♥' : '♡'}</span>)}
      </div>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Một chút yêu thương">v <span>♡</span> h.</a>
        <span className="header-note">MỘT CHÚT YÊU THƯƠNG, CHỈ DÀNH CHO EM</span>
        <span className="date-pill"><span /> 20 THÁNG 10</span>
      </header>
      <main id="home">
        <section className="hero" aria-labelledby="page-title" hidden={stage === 'letter'}>
          <div className="occasion"><span /> HAPPY VIETNAMESE WOMEN’S DAY <span /></div>
          <h1 id="page-title">Thế giới có thật nhiều điều đẹp.<br /><em>Với anh, đẹp nhất là em.</em></h1>
          <p className="hero-description">Một ngày đặc biệt. Một người đặc biệt.<br className="mobile-break" /> Và những điều anh muốn nói với em.</p>
          <div className="opening-wrap" key={run}>
            <p className={`opening-text ${stage !== 'scattered' ? 'assembled' : ''}`} aria-label={opening}>
              {opening}
            </p>
          </div>
          <div className="intro-status" aria-live="polite">
            {stage === 'scattered' ? <><span className="tiny-heart">♡</span><p>Những yêu thương đang tìm đường đến em…</p><div className="progress-track" key={run}><span /></div><button className="text-button" onClick={() => setStage('letter')}>Mở thư ngay ↗</button></> : <p className="ready-note">{stage === 'gathered' ? 'Và mọi yêu thương đều gọi tên em.' : 'Lá thư này, dành riêng cho em ↓'}</p>}
          </div>
        </section>
        {stage === 'letter' && <section className="letter-section" aria-labelledby="letter-title">
          <div className="letter-card">
            <div className="letter-topline"><span>MỘT LÁ THƯ NHỎ</span><span>20 / 10</span></div>
            <span className="letter-heart" aria-hidden="true">♡</span>
            <h2 id="letter-title">Hằng yêu của anh,</h2>
            <p>Nhân ngày 20/10, anh muốn gửi đến em một lời chúc thật dịu dàng: mong cô gái của anh luôn được bình an, được yêu thương và được là chính mình.</p>
            <p>Cảm ơn em vì đã đến bên anh, để những ngày bình thường cũng trở nên đáng nhớ. Nụ cười của em, những điều nhỏ bé em kể, sự hiện diện của em — tất cả đều là những điều anh trân trọng.</p>
            <blockquote>“Mong em luôn cười thật rạng rỡ.<br />Còn những ngày mỏi mệt, cứ để anh thương.”</blockquote>
            <p>Anh chúc em có đủ tự tin để theo đuổi điều mình thích, đủ can đảm để bước về phía ước mơ, và thật nhiều niềm vui trên hành trình ấy. Em không cần phải hoàn hảo để xứng đáng được yêu thương. Với anh, là em thôi đã đủ đặc biệt rồi.</p>
            <p>Không chỉ hôm nay, anh mong mỗi ngày bên em đều là một ngày có yêu thương. Anh muốn lắng nghe em nhiều hơn, cùng em chia sẻ những điều giản dị và cùng nhau giữ gìn những khoảnh khắc thật đẹp.</p>
            <p className="closing-wish">Chúc mừng ngày Phụ nữ Việt Nam,<br /><strong>Bùi Thu Hằng của anh!</strong></p>
            <div className="signature"><span>Thương em, thật nhiều.</span><strong className="handwritten">Người yêu em ♡</strong></div>
          </div>
          <div className="hug-area">
            <p>Một chút yêu thương nữa, dành cho em.</p>
            <button className="hug-button" onClick={() => setHug(value => value + 1)}>Gửi anh một cái ôm <span>♡</span></button>
            <p className="hug-response" role="status">{hug > 0 ? 'Ôm em thật chặt. Anh thương em nhiều lắm! ♥' : 'Bấm một cái, nhận thật nhiều yêu thương.'}</p>
            {hug > 0 && <div className="heart-burst" key={hug} aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <span key={i} style={{ '--burst-x': `${Math.cos(i / 16 * Math.PI * 2) * 160}px`, '--burst-y': `${Math.sin(i / 16 * Math.PI * 2) * 150 - 70}px`, '--burst-rotate': `${i * 23}deg` }}>♥</span>)}</div>}
            <button className="text-button replay" onClick={replay}>↻ Xem lại từ đầu</button>
          </div>
        </section>}
      </main>
      <footer><span>MADE WITH LOVE</span><span>♡</span><span>CHỈ DÀNH CHO BÙI THU HẰNG</span></footer>
    </div>
  );
  return stage === 'letter' ? page : animateCopy(page);
}
export default App;

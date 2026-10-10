import { useCallback, useEffect, useRef, useState, type ReactNode, type FormEvent } from 'react';
import { ResumeCtx, useResume } from '../hooks/resume';
import { EMAIL, LINKEDIN } from '../data/content';

// Same format and parameters as the previous lock.js and tools/encrypt_resume.py:
// "AKR1" | uint32 BE iterations | 16-byte salt | 12-byte IV | AES-256-GCM ciphertext+tag, key = PBKDF2-SHA256(code).
const MAX = 5, COOL = 60000, KEY = 'ak-resume-lock';
type Store = { f: number; u: number };
const read = (): Store => { try { return JSON.parse(sessionStorage.getItem(KEY) || '') || { f: 0, u: 0 }; } catch { return { f: 0, u: 0 }; } };
const save = (s: Store) => { try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable */ } };

class FormatError extends Error {}
async function decrypt(code: string): Promise<ArrayBuffer> {
  const res = await fetch(`${import.meta.env.BASE_URL}assets/resume.enc`, { cache: 'no-store' });
  if (!res.ok) throw new FormatError('load');
  const buf = new Uint8Array(await res.arrayBuffer());
  if (new TextDecoder().decode(buf.slice(0, 4)) !== 'AKR1') throw new FormatError('format');
  const iterations = new DataView(buf.buffer).getUint32(4), salt = buf.slice(8, 24), iv = buf.slice(24, 36), ct = buf.slice(36);
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(code), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  return crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
}

export function ResumeProvider({ children }: { children: ReactNode }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState<{ t: string; err?: boolean }>({ t: '' });
  const [wait, setWait] = useState(0);
  const [shake, setShake] = useState(0);

  const tickCooldown = useCallback(() => {
    const left = Math.ceil((read().u - Date.now()) / 1000);
    setWait(left > 0 ? left : 0);
    return left > 0;
  }, []);
  useEffect(() => {
    if (wait <= 0) return;
    const id = setTimeout(() => { if (!tickCooldown()) { setMsg({ t: 'You can try again now.' }); input.current?.focus(); } }, 1000);
    return () => clearTimeout(id);
  }, [wait, tickCooldown]);

  const open = useCallback(() => {
    const d = dlg.current; if (!d) return;
    if (!d.open) d.showModal();
    if (!url && !tickCooldown()) setTimeout(() => input.current?.focus(), 30);
  }, [url, tickCooldown]);

  useEffect(() => { if (location.hash === '#resume-access') { const t = setTimeout(open, 300); return () => clearTimeout(t); } }, [open]);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy || tickCooldown()) return;
    const code = (input.current?.value || '').trim();
    if (!code) { setMsg({ t: 'Please enter the access code.', err: true }); return; }
    if (!window.crypto?.subtle) { setMsg({ t: 'Your browser does not support secure decryption. Please contact me for a copy.', err: true }); return; }
    setBusy(true); setMsg({ t: '' });
    try {
      const pdf = await decrypt(code);
      save({ f: 0, u: 0 });
      setUrl(URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' })));
    } catch (err) {
      const s = read(); s.f++;
      if (s.f >= MAX) s.u = Date.now() + COOL * Math.min(8, 2 ** Math.floor(s.f / MAX - 1));
      save(s); input.current?.select(); setShake((n) => n + 1);
      if (err instanceof FormatError || err instanceof TypeError) setMsg({ t: 'The resume could not be loaded. Please try again later.', err: true });
      else if (tickCooldown()) setMsg({ t: '', err: true });
      else setMsg({ t: `That code didn't work. Please check it and try again (${MAX - (s.f % MAX)} left).`, err: true });
    } finally { setBusy(false); }
  }

  const close = () => dlg.current?.close();
  const status = wait > 0 ? `Too many attempts. Please wait ${wait}s.` : msg.t;

  return (
    <ResumeCtx.Provider value={open}>
      {children}
      <dialog ref={dlg} className={`lock-dialog${url ? ' unlocked' : ''}`} aria-labelledby="lock-title" onClick={(e) => { if (e.target === dlg.current) close(); }}>
        <div className={`lock-card${shake % 2 ? ' shake' : shake ? ' shake2' : ''}`}>
          <button className="lock-close" aria-label="Close" type="button" onClick={close}>×</button>
          <div className="lock-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26"><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></div>
          <h2 id="lock-title">Resume access</h2>
          <p className="lock-sub">{url ? 'Access granted. Thank you for your interest.' : 'Enter the access code you received to view the resume.'}</p>
          {!url && (
            <form className="lock-form" noValidate onSubmit={submit}>
              <label className="sr-only" htmlFor="lock-code">Access code</label>
              <input ref={input} id="lock-code" name="code" type={show ? 'text' : 'password'} autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="e.g. word-word-word-1234" required disabled={wait > 0} />
              <button type="button" className="lock-eye" aria-label={show ? 'Hide code' : 'Show code'} onClick={() => setShow((v) => !v)}>{show ? 'Hide' : 'Show'}</button>
              <button className="btn btn-primary lock-submit" type="submit" disabled={busy || wait > 0}>{busy ? 'Unlocking…' : 'Unlock resume'}</button>
            </form>
          )}
          <p className={`lock-msg${msg.err || wait > 0 ? ' err' : ''}`} role="status" aria-live="polite">{status}</p>
          {url && (
            <div className="lock-view">
              <iframe title="Resume" className="lock-frame" src={url} />
              <div className="lock-actions">
                <a className="btn btn-primary" href={url} target="_blank" rel="noopener">Open in new tab</a>
                <a className="btn btn-ghost" href={url} download="Anil_Kumar_Resume.pdf">Download PDF</a>
              </div>
            </div>
          )}
          <p className="lock-help">Need access? <a href={`mailto:${EMAIL}`}>Email me</a> or <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">message me on LinkedIn</a>.</p>
        </div>
      </dialog>
    </ResumeCtx.Provider>
  );
}

export function ResumeButton({ className = 'btn btn-ghost', children, onBeforeOpen }: { className?: string; children: ReactNode; onBeforeOpen?: () => void }) {
  const open = useResume();
  return <a href="#resume-access" className={className} data-resume onClick={(e) => { e.preventDefault(); if (onBeforeOpen) { onBeforeOpen(); setTimeout(open, 260); } else open(); }}>{children}</a>;
}

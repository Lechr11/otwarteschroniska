// src/components/Playground.tsx
// React island: dropdown województwa → fetch endpoint → JSON pretty print.

import { useState } from 'react';

const WOJEWODZTWA: Array<[string, string]> = [
  ['dolnoslaskie', 'Dolnośląskie'],
  ['kujawsko-pomorskie', 'Kujawsko-Pomorskie'],
  ['lubelskie', 'Lubelskie'],
  ['lubuskie', 'Lubuskie'],
  ['lodzkie', 'Łódzkie'],
  ['malopolskie', 'Małopolskie'],
  ['mazowieckie', 'Mazowieckie'],
  ['opolskie', 'Opolskie'],
  ['podkarpackie', 'Podkarpackie'],
  ['podlaskie', 'Podlaskie'],
  ['pomorskie', 'Pomorskie'],
  ['slaskie', 'Śląskie'],
  ['swietokrzyskie', 'Świętokrzyskie'],
  ['warminsko-mazurskie', 'Warmińsko-Mazurskie'],
  ['wielkopolskie', 'Wielkopolskie'],
  ['zachodniopomorskie', 'Zachodniopomorskie'],
];

// Display URL (pokazywany w endpoint label) — production absolute.
// Fetch URL — relative (same-origin), działa w dev (localhost:4321) i prod (otwarteschroniska.org.pl).
const DISPLAY_API = 'https://otwarteschroniska.org.pl/api/v1';
const FETCH_API = '/api/v1';

export default function Playground() {
  const [woj, setWoj] = useState<string>('');
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWoj = e.target.value;
    setWoj(newWoj);
    if (!newWoj) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${FETCH_API}/shelters/${newWoj}.json`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const endpoint = woj ? `GET ${DISPLAY_API}/shelters/${woj}.json` : 'GET /api/v1/shelters/{wojewodztwo}.json';

  const responseText = data
    ? JSON.stringify(data, null, 2)
    : '';
  const truncated = responseText.length > 2000;
  const displayText = truncated
    ? responseText.slice(0, 2000) + '\n\n... (skrócone, pełna odpowiedź pod URL endpointa)'
    : responseText;

  return (
    <div className="playground">
      <label className="playground-label">
        <span>Wybierz województwo:</span>
        <select value={woj} onChange={handleChange}>
          <option value="">-- wybierz --</option>
          {WOJEWODZTWA.map(([slug, label]) => (
            <option key={slug} value={slug}>{label}</option>
          ))}
        </select>
      </label>

      <div className="endpoint-display">
        <strong>Endpoint:</strong> <code>{endpoint}</code>
      </div>

      <div className="response-area">
        {loading && <p>Ładowanie...</p>}
        {error && <p className="error">Błąd: {error}</p>}
        {data ? (
          <pre>{displayText}</pre>
        ) : !loading && !error ? (
          <p className="muted">Wybierz województwo aby zobaczyć odpowiedź API.</p>
        ) : null}
      </div>

      <style>{`
        .playground {
          margin: 2rem 0;
          border: 1px solid var(--color-border, #e5e5e5);
          padding: 1.5rem;
          border-radius: 4px;
        }
        .playground-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .playground-label select {
          padding: 0.5rem;
          font-size: 1rem;
          border: 1px solid var(--color-border, #e5e5e5);
          background: white;
          font-family: inherit;
        }
        .endpoint-display {
          margin: 1rem 0;
          padding: 0.75rem;
          background: #f9f9f9;
          font-size: 0.9rem;
          border-radius: 3px;
        }
        .endpoint-display code {
          background: transparent;
          padding: 0;
        }
        .response-area pre {
          max-height: 400px;
          overflow-y: auto;
          font-size: 0.85rem;
          margin: 0;
        }
        .response-area .error { color: #c00; }
        .response-area .muted { color: #888; font-style: italic; }
      `}</style>
    </div>
  );
}

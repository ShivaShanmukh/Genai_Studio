import { useState, useRef, useEffect } from "react"
import { fal } from "@fal-ai/client"
import "./App.css"

const MODELS = [
  { id: "fal-ai/flux/schnell", label: "FLUX Schnell", desc: "Fast · General",      steps: 4  },
  { id: "fal-ai/flux/dev",     label: "FLUX Dev",     desc: "Quality · Creative",  steps: 28 },
  { id: "fal-ai/aura-flow",    label: "Aura Flow",    desc: "Artistic · Painterly", steps: 30 },
  { id: "fal-ai/fast-sdxl",    label: "SDXL",         desc: "Classic · Versatile",  steps: 30 },
]

const VOICES = [
  { id: "EXAVITQu4vr4xnSDxMaL", label: "Sarah",  desc: "Warm · Professional" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", label: "Liam",   desc: "Deep · Confident" },
  { id: "pFZP5JQG7iQjIQuC4Bku", label: "Lily",   desc: "Bright · Energetic" },
  { id: "onwK4e9ZLuTAKqWW03F9", label: "Daniel", desc: "Smooth · Trustworthy" },
]

const PRESETS = [
  { label: "Luxury Brand",  prompt: "A cinematic product shot of a luxury fragrance bottle on black marble, dramatic side lighting, ultra-detailed, 8K", caption: "Crafted for those who demand nothing less than extraordinary." },
  { label: "Tech Startup",  prompt: "Futuristic workspace with holographic interfaces, vibrant neon accents, editorial photography style, cinematic", caption: "Building tomorrow, one line of code at a time." },
  { label: "Wellness",      prompt: "Serene mountain valley at golden sunrise, misty atmosphere, peaceful, ultra-realistic nature photography", caption: "Find your centre. Breathe. Begin." },
  { label: "Fashion Edit",  prompt: "High fashion editorial, model in avant-garde outfit, minimalist studio, dramatic shadows, Vogue-style photography", caption: "Style is not what you wear. It is who you are." },
]

export default function App() {
  const [prompt, setPrompt]       = useState("")
  const [caption, setCaption]     = useState("")
  const [model, setModel]         = useState(MODELS[0].id)
  const [voice, setVoice]         = useState(VOICES[0].id)
  const [falKey, setFalKey]       = useState("")
  const [elKey, setElKey]         = useState("")
  const [imageUrl, setImageUrl]   = useState(null)
  const [audioUrl, setAudioUrl]   = useState(null)
  const [loading, setLoading]     = useState(false)
  const [loadStep, setLoadStep]   = useState("")
  const [error, setError]         = useState(null)
  const [generated, setGenerated] = useState(false)
  const [keysOpen, setKeysOpen]   = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    const k1 = localStorage.getItem("gbs_fal")
    const k2 = localStorage.getItem("gbs_el")
    if (k1) { setFalKey(k1); setKeysOpen(false) }
    if (k2) setElKey(k2)
  }, [])

  function saveKeys() {
    localStorage.setItem("gbs_fal", falKey)
    localStorage.setItem("gbs_el", elKey)
    setKeysOpen(false)
  }

  async function generate() {
    if (!prompt.trim()) return
    if (!falKey) { setError("Add your fal.ai API key to generate images."); return }
    setLoading(true); setError(null); setGenerated(false)
    setImageUrl(null); setAudioUrl(null)

    const activeModel = MODELS.find(m => m.id === model)
    try {
      fal.config({ credentials: falKey })

      setLoadStep("Submitting to " + (activeModel?.label ?? model) + "…")

      const result = await fal.subscribe(model, {
        input: {
          prompt,
          image_size: "landscape_16_9",
          num_inference_steps: activeModel?.steps ?? 28,
          num_images: 1,
        },
        onQueueUpdate: (update) => {
          if (update.status === "IN_QUEUE")    setLoadStep("Queued… waiting for runner…")
          if (update.status === "IN_PROGRESS") setLoadStep("Generating image…")
        },
      })

      const imgData = result.data
      const url = imgData.images?.[0]?.url ?? imgData.image?.url
      if (!url) throw new Error(`No image URL in response. Got: ${JSON.stringify(imgData).slice(0, 300)}`)
      setImageUrl(url)

      if (elKey && caption.trim()) {
        setLoadStep("Generating voiceover…")
        const vr = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
          method: "POST",
          headers: { "xi-api-key": elKey, "Content-Type": "application/json" },
          body: JSON.stringify({
            text: caption,
            model_id: "eleven_turbo_v2",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
          })
        })
        if (vr.ok) {
          const blob = await vr.blob()
          setAudioUrl(URL.createObjectURL(blob))
        } else {
          const errTxt = await vr.text().catch(() => "")
          setError(`Image generated! Voiceover failed (ElevenLabs ${vr.status}): ${errTxt.slice(0, 120)}`)
        }
      }
      setGenerated(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false); setLoadStep("")
    }
  }

  return (
    <div className="app">
      <header className="hdr">
        <div className="hdr-left">
          <div className="hdr-logo">◈ Generative Brand Studio</div>
          <div className="hdr-sub">AI Creative Pipeline · fal.ai · ElevenLabs · Built by Siva. I</div>
        </div>
        <div className="hdr-pills">
          <span className="hpill">fal.ai</span>
          <span className="hpill">ElevenLabs</span>
          <span className="hpill">React + Vite</span>
        </div>
      </header>

      <main className="main">

        {/* KEYS */}
        <div className="keys-wrap">
          <button className="keys-tog" onClick={() => setKeysOpen(o => !o)}>
            <span>{keysOpen ? "− Hide keys" : "+ API Keys"}</span>
            {!falKey && <span className="badge-req">Required</span>}
            {falKey  && <span className="badge-ok">✓ Set</span>}
          </button>
          {keysOpen && (
            <div className="keys-body">
              <div className="keys-row">
                <div className="kf">
                  <label>fal.ai Key <span className="req-star">*</span></label>
                  <input type="password" placeholder="fal_..." value={falKey} onChange={e => setFalKey(e.target.value)} />
                  <a className="key-link" href="https://fal.ai/dashboard/keys" target="_blank" rel="noreferrer">Get free key → fal.ai</a>
                </div>
                <div className="kf">
                  <label>ElevenLabs Key <span className="opt-tag">optional — for voiceover</span></label>
                  <input type="password" placeholder="sk_..." value={elKey} onChange={e => setElKey(e.target.value)} />
                  <a className="key-link" href="https://elevenlabs.io" target="_blank" rel="noreferrer">Get free key → elevenlabs.io</a>
                </div>
              </div>
              <button className="btn-save" onClick={saveKeys}>Save & Continue →</button>
            </div>
          )}
        </div>

        <div className="grid">

          {/* LEFT CONTROLS */}
          <div className="controls">

            <div className="cs">
              <div className="cs-label">Presets</div>
              <div className="presets">
                {PRESETS.map(p => (
                  <button key={p.label} className="preset" onClick={() => { setPrompt(p.prompt); setCaption(p.caption) }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="cs">
              <div className="cs-label">Visual Prompt</div>
              <textarea
                className="prompt-ta"
                rows={4}
                placeholder="Describe the brand visual you want to create…"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
            </div>

            <div className="cs">
              <div className="cs-label">Image Model</div>
              <div className="mgrid">
                {MODELS.map(m => (
                  <button key={m.id} className={`mbtn ${model === m.id ? "active" : ""}`} onClick={() => setModel(m.id)}>
                    <span className="mn">{m.label}</span>
                    <span className="md">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="cs">
              <div className="cs-label">Voiceover Caption <span className="opt-tag">· needs ElevenLabs key</span></div>
              <input className="caption-in" type="text" placeholder="Text to voice over the image…" value={caption} onChange={e => setCaption(e.target.value)} />
            </div>

            <div className="cs">
              <div className="cs-label">Voice</div>
              <div className="vgrid">
                {VOICES.map(v => (
                  <button key={v.id} className={`vbtn ${voice === v.id ? "active" : ""}`} onClick={() => setVoice(v.id)}>
                    <span className="vn">{v.label}</span>
                    <span className="vd">{v.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button className={`gen-btn ${loading ? "busy" : ""}`} onClick={generate} disabled={loading || !prompt.trim()}>
              {loading ? <><span className="spin" /> {loadStep}</>
                       : <><span>◈</span> Generate Brand Experience</>}
            </button>

            {error && <div className="err">{error}</div>}

          </div>

          {/* RIGHT OUTPUT */}
          <div className="output">
            {!generated && !loading && (
              <div className="empty">
                <div className="empty-icon">◈</div>
                <div className="empty-t">Your brand experience appears here</div>
                <div className="empty-s">Add your fal.ai key · write a prompt · hit Generate</div>
              </div>
            )}
            {loading && (
              <div className="out-loading">
                <div className="pulse" />
                <div className="load-t">{loadStep || "Working…"}</div>
              </div>
            )}
            {generated && imageUrl && (
              <div className="result">
                <div className="img-wrap">
                  <img src={imageUrl} alt="Generated brand visual" />
                  <div className="img-overlay">
                    <a href={imageUrl} target="_blank" rel="noreferrer" className="dl">↗ Open full size</a>
                  </div>
                </div>
                {audioUrl && (
                  <div className="audio-wrap">
                    <span className="audio-lbl">♪ Voiceover</span>
                    <audio ref={audioRef} controls src={audioUrl} />
                  </div>
                )}
                <div className="result-meta">
                  <span>{MODELS.find(m => m.id === model)?.label}</span>
                  {audioUrl && <span>{VOICES.find(v => v.id === voice)?.label} voice</span>}
                  <span>16 : 9</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* PIPELINE VIZ */}
        <div className="pipeline">
          <div className="pipe-label">Pipeline</div>
          <div className="pipe-nodes">
            {[
              { icon: "✎", t: "Text Prompt",  s: "User input" },
              null,
              { icon: "◈", t: "fal.ai",       s: "Image model" },
              null,
              { icon: "♪", t: "ElevenLabs",   s: "Voice synth" },
              null,
              { icon: "⬡", t: "React UI",     s: "Live output" },
            ].map((n, i) =>
              n === null
                ? <div key={i} className="pipe-arrow">→</div>
                : <div key={i} className="pipe-node">
                    <div className="pn-icon">{n.icon}</div>
                    <div className="pn-t">{n.t}</div>
                    <div className="pn-s">{n.s}</div>
                  </div>
            )}
          </div>
        </div>

      </main>

      <footer className="footer">
        <strong>Siva. I</strong> · Generative Brand Studio · AI Creative Pipeline Demo
        <span className="footer-stack">React + Vite · fal.ai · ElevenLabs · Railway</span>
      </footer>
    </div>
  )
}

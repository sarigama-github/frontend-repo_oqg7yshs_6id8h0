import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Shield, Rocket, CheckCircle2, Sparkles, Play, Lock, ChevronRight } from 'lucide-react'

const Feature = ({ icon: Icon, title, children }) => (
  <div className="p-5 rounded-xl bg-white/60 backdrop-blur border border-white/40 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-600"><Icon size={18} /></div>
      <h4 className="font-semibold text-gray-800">{title}</h4>
    </div>
    <p className="text-sm text-gray-600">{children}</p>
  </div>
)

const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
    <CheckCircle2 size={14} /> {children}
  </span>
)

function Playground() {
  const [code, setCode] = useState("const greet = (name) => {\n  const el = document.getElementById('app')\n  // Warning: using innerHTML\n  el.innerHTML = `Hello ${name}`\n}\n")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const analyze = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: 'javascript' })
      })
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setResult({ error: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      <div className="bg-white/70 backdrop-blur border border-white/40 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
          <span className="text-xs text-gray-500">live code</span>
          <button onClick={analyze} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors">
            <Play size={14} /> Run analysis
          </button>
        </div>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-64 p-4 font-mono text-sm outline-none resize-none bg-transparent" />
      </div>

      <div className="bg-white/70 backdrop-blur border border-white/40 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Agent output</h4>
        {!result && <p className="text-sm text-gray-500">Click Run analysis to see the agents work.</p>}
        {loading && <p className="text-sm text-indigo-600">Analyzing...</p>}
        {result && result.error && <p className="text-sm text-red-600">{result.error}</p>}
        {result && !result.error && (
          <div className="space-y-3">
            <div className="flex items-center gap-2"><Shield className="text-indigo-600" size={16} /><span className="text-sm">Risk score: <span className="font-mono">{result.score}</span></span></div>
            {result.findings?.length > 0 ? (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Findings</p>
                <ul className="space-y-2">
                  {result.findings.map((f, i) => (
                    <li key={i} className="text-sm bg-red-50 border border-red-200 rounded-lg p-2">
                      <div className="font-semibold text-red-700">[{f.severity}] {f.title}</div>
                      <div className="text-xs text-red-700/80">Line {f.line}: {f.description}</div>
                      <div className="text-xs mt-1 text-gray-700">Fix: {f.recommendation}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2">No issues found</p>
            )}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Agent steps</p>
              <ol className="space-y-1 list-decimal list-inside text-xs text-gray-600">
                {result.steps?.map((s, i) => (
                  <li key={i}><span className="font-medium text-gray-700">{s.agent}</span>: {s.action} — <span className="font-mono text-gray-700">{s.elapsed_ms}ms</span></li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  const [metrics, setMetrics] = useState({ count: 1247 })
  const [social, setSocial] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    fetch(`${baseUrl}/api/metrics/issues-fixed-today`).then(r => r.json()).then(setMetrics).catch(()=>{})
    fetch(`${baseUrl}/api/social-proof`).then(r => r.json()).then(setSocial).catch(()=>{})
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50">
      <header className="px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">AF</div>
          <span className="font-semibold text-gray-800">AgentForge</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <a href="#how" className="hover:text-indigo-600">How it works</a>
          <a href="#security" className="hover:text-indigo-600">Security</a>
          <a href="#pricing" className="hover:text-indigo-600">Pricing</a>
          <a href="/test" className="hover:text-indigo-600">Status</a>
          <a href="#docs" className="hover:text-indigo-600">Docs</a>
        </nav>
        <div className="flex items-center gap-2">
          <a className="hidden md:inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50" href="#">
            <Github size={16} /> Star on GitHub
          </a>
          <a className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700" href="#">
            Install GitHub App
          </a>
        </div>
      </header>

      <main className="px-6 md:px-12">
        <section className="py-10 md:py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Badge>Used by engineers at Google, Meta, Stripe</Badge>
            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              AI Agents That Review Code Better Than Senior Engineers
            </h1>
            <p className="mt-4 text-gray-600 max-w-xl">
              Ship fast without shipping vulns. Multi-agent security reviews, RLHF-tuned, integrated with your CI.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-900 text-white hover:bg-black" href="#">
                <Rocket size={16} /> Start free trial
              </a>
              <a className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-200 hover:bg-gray-50" href="#">
                Book demo <ChevronRight size={16} />
              </a>
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm text-gray-700">
              <Shield className="text-emerald-600" size={18} /> Issues fixed today: <span className="font-mono">{metrics.count.toLocaleString()}</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200/40 to-sky-200/40 blur-2xl rounded-3xl" />
            <div className="relative rounded-2xl border bg-white/70 backdrop-blur border-white/40 p-4 shadow-lg">
              <Playground />
            </div>
          </div>
        </section>

        <section id="how" className="py-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">How it works</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Feature icon={Sparkles} title="Multi-agent pipeline">Experts collaborate to scan, reason and remediate in seconds.</Feature>
            <Feature icon={Lock} title="Privacy-first">We never train on your private code. SOC2-ready controls.</Feature>
            <Feature icon={Shield} title="Better than rules">AI reasoning catches what rule-based tools miss.</Feature>
          </div>
        </section>

        <section id="security" className="py-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Security showcase</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white/60 border">
              <div className="text-sm text-gray-700 font-semibold">CVE-2024-12345 caught pre-prod</div>
              <p className="text-sm text-gray-600 mt-2">Prevented secrets exposure in Node microservice before release.</p>
            </div>
            <div className="p-5 rounded-xl bg-white/60 border">
              <div className="text-sm text-gray-700 font-semibold">Vs competitors</div>
              <p className="text-sm text-gray-600 mt-2">Higher detection rate with fewer false positives.</p>
            </div>
            <div className="p-5 rounded-xl bg-white/60 border">
              <div className="text-sm text-gray-700 font-semibold">Compliance ready</div>
              <p className="text-sm text-gray-600 mt-2">SOC2, GDPR controls with audit logs and SSO.</p>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Pricing</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl border bg-white/70">
              <div className="text-sm font-semibold text-gray-700">Free</div>
              <div className="mt-2 text-3xl font-extrabold">$0</div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>10 analyses / month</li>
                <li>Public repos only</li>
              </ul>
              <button className="mt-4 w-full px-4 py-2 rounded-lg border">Get started</button>
            </div>
            <div className="p-6 rounded-2xl border bg-gray-900 text-white ring-2 ring-indigo-500">
              <div className="text-sm font-semibold">Team</div>
              <div className="mt-2 text-3xl font-extrabold">$49<span className="text-xs font-medium opacity-80">/dev/mo</span></div>
              <ul className="mt-4 space-y-2 text-sm opacity-90">
                <li>Unlimited private repos</li>
                <li>RLHF tuned agents</li>
                <li>Slack integration</li>
              </ul>
              <button className="mt-4 w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500">Start trial</button>
            </div>
            <div className="p-6 rounded-2xl border bg-white/70">
              <div className="text-sm font-semibold text-gray-700">Enterprise</div>
              <div className="mt-2 text-3xl font-extrabold">Custom</div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>Self-hosted</li>
                <li>Custom agents</li>
                <li>Dedicated SLA</li>
              </ul>
              <button className="mt-4 w-full px-4 py-2 rounded-lg border">Talk to sales</button>
            </div>
          </div>
        </section>

        <footer className="py-12 text-sm text-gray-600">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} AgentForge</p>
            <div className="flex items-center gap-4">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Security</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App

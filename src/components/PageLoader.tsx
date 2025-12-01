import React from 'react'
import Router from 'next/router'

// A lightweight skeleton page loader that listens to Next.js router events
// Shows a full-page skeleton overlay while navigating between routes.
export default function PageLoader(): React.ReactElement | null {
  const [visible, setVisible] = React.useState(false)
  const [minVisible, setMinVisible] = React.useState(false)

  React.useEffect(() => {
    let timeout: NodeJS.Timeout | null = null
    let minTimeout: NodeJS.Timeout | null = null

    const show = () => {
      // introduce a small debounce so very-fast navigations don't flash the loader
      timeout = setTimeout(() => {
        setVisible(true)
        // ensure it's visible at least 250ms to avoid flicker
        minTimeout = setTimeout(() => setMinVisible(true), 250)
      }, 80)
    }

    const hide = () => {
      if (timeout) { clearTimeout(timeout); timeout = null }
      // if minVisible hasn't been reached, wait the remainder then hide
      if (!minVisible) {
        // ensure at least 300ms total
        setTimeout(() => {
          setVisible(false)
          setMinVisible(false)
        }, 300)
      } else {
        setVisible(false)
        setMinVisible(false)
      }
    }

    Router.events.on('routeChangeStart', show)
    Router.events.on('routeChangeComplete', hide)
    Router.events.on('routeChangeError', hide)

    return () => {
      Router.events.off('routeChangeStart', show)
      Router.events.off('routeChangeComplete', hide)
      Router.events.off('routeChangeError', hide)
      if (timeout) clearTimeout(timeout)
      if (minTimeout) clearTimeout(minTimeout)
    }
  }, [minVisible])

  if (!visible) return null

  return (
    <div aria-hidden={!visible} className="page-loader-overlay">
      <div className="page-loader-skeleton">
        <div className="skeleton-hero" />
        <div className="skeleton-row">
          <div className="skeleton-card small" />
          <div className="skeleton-card small" />
          <div className="skeleton-card small" />
        </div>
        <div className="skeleton-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-item">
              <div className="skeleton-thumb" />
              <div className="skeleton-line short" />
              <div className="skeleton-line" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .page-loader-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(4px);
          padding-top: 48px;
        }

        .page-loader-skeleton {
          width: min(1100px, 96%);
          max-width: 1100px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: fadeIn 160ms ease-out;
        }

        .skeleton-hero {
          height: 220px;
          border-radius: 10px;
          background: linear-gradient(90deg, #eee 25%, #f7f7f7 50%, #eee 75%);
          background-size: 200% 100%;
          animation: shimmer 1.2s linear infinite;
        }

        .skeleton-row { display:flex; gap:12px }
        .skeleton-card { flex:1; height:72px; border-radius:8px; background:#eee; background-image: linear-gradient(90deg,#eee 25%, #f7f7f7 50%, #eee 75%); background-size:200% 100%; animation: shimmer 1.2s linear infinite }
        .skeleton-card.small { height:56px }

        .skeleton-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap:16px }
        .skeleton-item { padding:12px; border-radius:8px; background:transparent; display:flex; flex-direction:column; gap:8px }
        .skeleton-thumb { height:120px; border-radius:6px; background: linear-gradient(90deg,#ececec 25%, #f7f7f7 50%, #ececec 75%); background-size:200% 100%; animation: shimmer 1.2s linear infinite }
        .skeleton-line { height:12px; border-radius:6px; background:#eee; background-image: linear-gradient(90deg,#eee 25%, #f7f7f7 50%, #eee 75%); background-size:200% 100%; animation: shimmer 1.2s linear infinite }
        .skeleton-line.short { width:60% }

        @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        @keyframes fadeIn { from { opacity:0; transform: translateY(-6px) } to { opacity:1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}



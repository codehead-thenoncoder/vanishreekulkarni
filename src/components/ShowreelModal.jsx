import { useEffect } from 'react'

export default function ShowreelModal({ isOpen, onClose, videoId = 'cCqJzJ0IXsk' }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="showreel-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Official Showreel">
      <div className="showreel-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="showreel-modal-close" onClick={onClose} aria-label="Close Showreel">
          &times;
        </button>
        <div className="showreel-modal-header">
          <span className="pill pill-light">Official Showreel</span>
          <h3 className="showreel-modal-title">Vanishree Kulkarni — Acting & Voice Showreel</h3>
        </div>
        <div className="showreel-video-wrap">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="Vanishree Kulkarni Showreel"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}

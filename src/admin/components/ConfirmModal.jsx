export default function ConfirmModal({ title, body, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3>{title}</h3>
          {body && <p className="muted">{body}</p>}
          <div className="modal-actions">
            <button className="btn-ghost" onClick={onCancel}>Cancel</button>
            <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    )
  }
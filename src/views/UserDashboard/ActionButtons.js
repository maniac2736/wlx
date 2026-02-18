import { actions } from "./actionButton";

export default function ActionButtons() {
  return (
    <div className="row g-3 mb-4">
      {actions.map((action) => (
        <div key={action.id} className="col-6 col-md-3">
          <button
            onClick={action.onClick}
            className="btn w-100 p-3 p-md-4 border-0 shadow-sm transition-card d-flex flex-column align-items-center"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div
              className="mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: "rgba(0, 98, 255, 0.08)",
                borderRadius: "16px",
                color: "#0062ff",
              }}
            >
              <i className={`${action.iconClass} fs-3`}></i>
            </div>

            <span
              className="fw-bold text-dark"
              style={{ fontSize: "0.9rem", letterSpacing: "-0.2px" }}
            >
              {action.label}
            </span>
          </button>
        </div>
      ))}

      <style>{`
        .transition-card {
          position: relative;
          top: 0;
        }
        
        .transition-card:hover {
          top: -4px;
          background-color: #ffffff !important;
          box-shadow: 0 12px 24px rgba(0, 98, 255, 0.1) !important;
        }

        .transition-card:active {
          transform: scale(0.96);
          top: 0;
          box-shadow: 0 4px 8px rgba(0, 98, 255, 0.05) !important;
        }

        /* Ensuring icons pop on hover */
        .transition-card:hover i {
          transform: scale(1.1);
          transition: transform 0.2s ease;
        }
      `}</style>
    </div>
  );
}

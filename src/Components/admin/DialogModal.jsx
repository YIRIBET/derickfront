import React from "react";

const ModalDialog = ({
  id,
  title,
  message,
  type = "info", // 'success' | 'error' | 'warning' | 'info'
  onConfirm = null,
  onCancel = null,
  showActions = false,
}) => {
  const getColorClass = () => {
    switch (type) {
      case "success": return "text-green-600";
      case "error": return "text-red-600";
      case "warning": return "text-yellow-600";
      default: return "text-blue-600";
    }
  };

  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <h3 className={`font-bold text-lg ${getColorClass()}`}>{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            {showActions ? (
              <>
                <button className="btn" onClick={onCancel}>Cancelar</button>
                <button className="btn btn-error" onClick={onConfirm}>Confirmar</button>
              </>
            ) : (
              <button className="btn btn-primary">Aceptar</button>
            )}
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalDialog;

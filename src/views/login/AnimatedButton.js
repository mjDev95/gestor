import React, { useRef, useEffect } from "react";
import { Check, ExclamationCircle } from "react-bootstrap-icons";
import { morphToCircle, morphToRect, bounceCheck, showErrorMsg } from "../../utils/gsapAnimations";

const AnimatedButton = ({ loading, success, error, onClick, children, btnRef, errorMsgRef, ...props}) => {
  const localBtnRef = useRef();
  const localErrorMsgRef = useRef();
  const buttonRef = btnRef || localBtnRef;
  const errorRef = errorMsgRef || localErrorMsgRef;

  useEffect(() => {
    if (loading) {
      morphToCircle(buttonRef);
    } else if (success) {
      bounceCheck(buttonRef);
    } else if (error) {
      morphToRect(buttonRef);
      setTimeout(() => {
        if (errorRef.current) {
          showErrorMsg(errorRef);
        }
      }, 0);
      setTimeout(() => {
        morphToRect(buttonRef);
      }, 3000);
    } else {
      morphToRect(buttonRef);
    }
  }, [loading, success, error, buttonRef, errorRef]);

  return (
    <button
      type="submit"
      ref={buttonRef}
      className={`btn w-100 m-0 py-0 morph-btn ${success ? "btn-success" : error ? "btn-danger" : "btn-primary"}`}
      onClick={onClick}
      disabled={loading || success || !!error}
      style={{
        width: error ? "100%" : (loading || success ? 220 : 120),
        height: 56,
        borderRadius: loading || success ? "50%" : "1.5rem",
        transition: "all 0.4s cubic-bezier(.68,-0.55,.27,1.55)",
        flex: error ? 1 : undefined
      }}
      {...props}
    >
      {success ? (
        <Check size={28} className="bounce-in" />
      ) : loading ? (
        <span className="spinner-border spinner-border-sm" />
      ) : error ? (
        <div ref={errorRef} className={`align-items-center justify-content-center text-start ${error ? "d-flex w-100" : "d-none w-0"}`} style={{ opacity: 0, transform: "translateX(500%)" }} >
          <ExclamationCircle size={20} className="me-2" />
          <span className="flex-grow-1">{error}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default AnimatedButton;

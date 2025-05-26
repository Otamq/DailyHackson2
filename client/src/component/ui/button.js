import React from 'react';

export function Button({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "0.5em 1em",
        fontSize: "1em",
        borderRadius: "6px",
        border: "1px solid gray",
        backgroundColor: disabled ? "#ccc" : "#007bff",
        color: "white",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

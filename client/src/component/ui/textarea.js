import React from 'react';

export function Textarea({ value, onChange, rows, className }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows || 5}
      className={className}
      style={{
        width: "100%",
        padding: "0.5em",
        fontFamily: "monospace",
        fontSize: "1em",
        border: "1px solid #ccc",
        borderRadius: "6px"
      }}
    />
  );
}

"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function CustomDropdown({
  label,
  value,
  options,
  onChange,
  placeholder = "Select",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (nextValue) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown" ref={rootRef}>
      {label ? <span className="dropdown-label">{label}</span> : null}
      <div className={`dropdown-shell ${isOpen ? "open" : ""}`}>
        <button
          type="button"
          className={`dropdown-trigger ${isOpen ? "open" : ""}`}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="dropdown-kicker">Choose</span>
          <span className="dropdown-text">
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`dropdown-chevron ${isOpen ? "open" : ""}`}
          />
        </button>
      </div>

      {isOpen ? (
        <ul className="dropdown-menu" role="listbox">
          <li className="dropdown-menu-head">Available options</li>
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  className={`dropdown-option ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="dropdown-option-left">
                    <span
                      className={`option-dot ${isSelected ? "selected" : ""}`}
                    />
                    <span>{option.label}</span>
                  </span>
                  {isSelected ? <Check size={15} /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

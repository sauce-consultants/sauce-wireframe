"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { IconButton } from "./icon-button";
import { Portal } from "./portal";
import { useFloating } from "./use-floating";

type DatePickerMode = "date" | "datetime" | "time";

interface DatePickerProps {
  label: string;
  mode?: DatePickerMode;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatDisplay(value: Date | null | undefined, mode: DatePickerMode): string {
  if (!value) return "";
  const date = `${pad(value.getDate())}/${pad(value.getMonth() + 1)}/${value.getFullYear()}`;
  const time = `${pad(value.getHours())}:${pad(value.getMinutes())}`;
  if (mode === "date") return date;
  if (mode === "time") return time;
  return `${date} ${time}`;
}

function defaultPlaceholder(mode: DatePickerMode): string {
  if (mode === "date") return "DD/MM/YYYY";
  if (mode === "time") return "HH:MM";
  return "DD/MM/YYYY HH:MM";
}

/* -----------------------------------------------------------------------
   Time Spinner
   ----------------------------------------------------------------------- */

function TimeSpinner({
  hours,
  minutes,
  onChangeHours,
  onChangeMinutes,
}: {
  hours: number;
  minutes: number;
  onChangeHours: (h: number) => void;
  onChangeMinutes: (m: number) => void;
}) {
  const incHour = () => onChangeHours((hours + 1) % 24);
  const decHour = () => onChangeHours((hours - 1 + 24) % 24);
  const incMin = () => onChangeMinutes((minutes + 1) % 60);
  const decMin = () => onChangeMinutes((minutes - 1 + 60) % 60);

  return (
    <div className="flex items-center justify-center gap-1">
      <div className="flex flex-col items-center">
        <button type="button" onClick={incHour} className="p-1 hover:bg-gray-light" aria-label="Increase hours">
          <ChevronUp size={16} />
        </button>
        <span className="font-mono font-bold text-xl w-10 text-center">{pad(hours)}</span>
        <button type="button" onClick={decHour} className="p-1 hover:bg-gray-light" aria-label="Decrease hours">
          <ChevronDown size={16} />
        </button>
      </div>
      <span className="font-mono font-bold text-xl pb-0.5">:</span>
      <div className="flex flex-col items-center">
        <button type="button" onClick={incMin} className="p-1 hover:bg-gray-light" aria-label="Increase minutes">
          <ChevronUp size={16} />
        </button>
        <span className="font-mono font-bold text-xl w-10 text-center">{pad(minutes)}</span>
        <button type="button" onClick={decMin} className="p-1 hover:bg-gray-light" aria-label="Decrease minutes">
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------
   DatePicker
   ----------------------------------------------------------------------- */

function DatePicker({
  label,
  mode = "date",
  value,
  onChange,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  className = "",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());
  const { triggerRef, pos } = useFloating(open);
  const panelRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  const hours = value ? value.getHours() : 0;
  const minutes = value ? value.getMinutes() : 0;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, triggerRef]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const selectDay = (day: number) => {
    const d = new Date(year, month, day, hours, minutes);
    onChange?.(d);
    if (mode === "date") setOpen(false);
  };

  const setTime = (h: number, m: number) => {
    if (mode === "time") {
      const d = new Date();
      d.setHours(h, m, 0, 0);
      onChange?.(d);
    } else if (value) {
      const d = new Date(value);
      d.setHours(h, m, 0, 0);
      onChange?.(d);
    } else {
      const d = new Date();
      d.setHours(h, m, 0, 0);
      onChange?.(d);
    }
  };

  const showCalendar = mode === "date" || mode === "datetime";
  const showTime = mode === "time" || mode === "datetime";
  const TriggerIcon = mode === "time" ? Clock : Calendar;
  const displayValue = formatDisplay(value, mode);
  const resolvedPlaceholder = placeholder || defaultPlaceholder(mode);

  return (
    <div className={className} ref={triggerRef}>
      <label className="block text-sm font-semibold mb-1.5">
        {label}
        {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`
          w-full h-12 border-4 ${error ? "border-danger" : "border-black"} bg-white
          px-3 text-left text-base flex items-center justify-between
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
          disabled:opacity-50
        `}
      >
        <span className={displayValue ? "text-black" : "text-text-muted"}>
          {displayValue || resolvedPlaceholder}
        </span>
        <TriggerIcon size={20} className="text-text-muted" />
      </button>

      {open && pos && (
        <Portal>
          <div
            ref={panelRef}
            className="absolute z-dropdown border-4 border-black bg-white p-4 shadow-md"
            style={{ top: pos.top + 4, left: pos.left, width: pos.width }}
          >
          {showCalendar && (
            <>
              <div className="flex items-center justify-between mb-4">
                <IconButton
                  icon={<ChevronLeft size={20} />}
                  aria-label="Previous month"
                  variant="ghost"
                  size="sm"
                  onClick={prevMonth}
                />
                <span className="font-semibold text-sm">
                  {MONTHS[month]} {year}
                </span>
                <IconButton
                  icon={<ChevronRight size={20} />}
                  aria-label="Next month"
                  variant="ghost"
                  size="sm"
                  onClick={nextMonth}
                />
              </div>

              <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS.map((d) => (
                  <span key={d} className="text-xs font-mono text-text-muted text-center py-1">
                    {d}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <span key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(year, month, day);
                  const isToday = isSameDay(date, today);
                  const isSelected = value ? isSameDay(date, value) : false;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => selectDay(day)}
                      className={`
                        h-10 w-10 flex items-center justify-center text-sm
                        transition-colors
                        ${isSelected ? "bg-black text-white font-bold" : "hover:bg-gray-light"}
                        ${isToday && !isSelected ? "border-2 border-black font-bold" : ""}
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {showTime && (
            <div className={showCalendar ? "border-t-2 border-gray-light mt-4 pt-4" : ""}>
              <p className="text-xs font-mono text-text-muted text-center mb-2">Time</p>
              <TimeSpinner
                hours={hours}
                minutes={minutes}
                onChangeHours={(h) => setTime(h, minutes)}
                onChangeMinutes={(m) => setTime(hours, m)}
              />
            </div>
          )}
          </div>
        </Portal>
      )}

      {(error || helperText) && (
        <p className={`text-sm mt-1.5 ${error ? "text-danger" : "text-text-muted"}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export { DatePicker, type DatePickerProps, type DatePickerMode };

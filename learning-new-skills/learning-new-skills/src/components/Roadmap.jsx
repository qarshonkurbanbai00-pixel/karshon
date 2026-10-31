import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { skills, weekLabels } from "../data";

export function readSavedPlan() {
  try {
    const saved = JSON.parse(localStorage.getItem("skillspace-plan") || "{}");
    return {
      skill: skills.some((s) => s.id === saved.skill) ? saved.skill : "coding",
      completed: Array.isArray(saved.completed)
        ? saved.completed.filter((x) => Number.isInteger(x) && x >= 0 && x < 4)
        : [],
    };
  } catch {
    return { skill: "coding", completed: [] };
  }
}

export default function Roadmap({ plan, setPlan, storageAvailable = true }) {
  const [activeWeek, setActiveWeek] = useState(0);
  const [notice, setNotice] = useState("");
  const skill = skills.find((s) => s.id === plan.skill) || skills[0];
  const count = new Set(plan.completed).size;
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(t);
  }, [notice]);
  const toggle = (index) =>
    setPlan((p) => ({
      ...p,
      completed: p.completed.includes(index)
        ? p.completed.filter((i) => i !== index)
        : [...p.completed, index],
    }));
  const download = () => {
    const text =
      `MY LEARNING ROADMAP\nSkill: ${skill.name}\n\nSmall steps. Real progress.\n\n` +
      weekLabels
        .map(
          (label, i) =>
            `WEEK ${i + 1}: ${label}\n${plan.completed.includes(i) ? "[Completed]" : "[To do]"} ${skill.weeks[i]}\n`,
        )
        .join("\n") +
      "\nTry 15 minutes of practice a day. Adjust the pace to fit your life.\n\nNever stop learning!\nSKILLSPACE";
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-${skill.id}-roadmap.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Your roadmap has been downloaded.");
  };
  return (
    <div className="roadmap-shell">
      <div className="roadmap-toolbar">
        <div>
          <label className="micro" htmlFor="roadmap-skill">
            YOUR LEARNING PATH
          </label>
          <select
            id="roadmap-skill"
            value={plan.skill}
            onChange={(e) => {
              setPlan({ skill: e.target.value, completed: [] });
              setActiveWeek(0);
            }}
          >
            {skills.map((s) => (
              <option value={s.id} key={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="roadmap-actions">
          <button className="text-button" onClick={download}>
            <ArrowDownToLine size={15} /> Save plan
          </button>
          <button
            className="icon-button"
            aria-label="Reset roadmap progress"
            title="Reset checklist"
            onClick={() => {
              setPlan((p) => ({ ...p, completed: [] }));
              setNotice("Your checklist is reset. A fresh start!");
            }}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
      <div className="roadmap-progress">
        <div>
          <span>
            {count === 4
              ? "You did it. Keep growing!"
              : "Every small step counts."}
          </span>
          <strong>{count} of 4 steps</strong>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Roadmap progress"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={4}
        >
          <span style={{ width: `${(count / 4) * 100}%` }} />
        </div>
      </div>
      <div className="week-tabs" role="tablist" aria-label="Learning weeks">
        {weekLabels.map((label, i) => (
          <button
            role="tab"
            aria-selected={activeWeek === i}
            aria-controls="week-panel"
            id={`week-tab-${i}`}
            key={label}
            tabIndex={activeWeek === i ? 0 : -1}
            onClick={() => setActiveWeek(i)}
            onKeyDown={(e) => {
              const next = {
                ArrowRight: (i + 1) % 4,
                ArrowDown: (i + 1) % 4,
                ArrowLeft: (i + 3) % 4,
                ArrowUp: (i + 3) % 4,
                Home: 0,
                End: 3,
              }[e.key];
              if (next !== undefined) {
                e.preventDefault();
                setActiveWeek(next);
                document.getElementById(`week-tab-${next}`)?.focus();
              }
            }}
            className={activeWeek === i ? "active" : ""}
          >
            <span
              className={`week-dot ${plan.completed.includes(i) ? "done" : ""}`}
            >
              {plan.completed.includes(i) ? <Check size={16} /> : `0${i + 1}`}
            </span>
            <span>
              <small>WEEK {i + 1}</small>
              <strong>{label}</strong>
            </span>
          </button>
        ))}
      </div>
      <div
        className="week-panel"
        role="tabpanel"
        id="week-panel"
        aria-labelledby={`week-tab-${activeWeek}`}
      >
        <div className="week-copy">
          <span className="eyebrow">
            <Sparkles size={13} /> YOUR NEXT SMALL WIN
          </span>
          <h3>{skill.weeks[activeWeek]}</h3>
          <p>
            {
              [
                "Keep it simple. Choose one beginner resource and set aside a little time.",
                "Practice for a short time each day. A steady habit is more useful than a perfect schedule.",
                "Use what you know in a small project. Ask someone for one helpful suggestion.",
                "Look back at your progress. Share what you made and choose your next goal.",
              ][activeWeek]
            }
          </p>
        </div>
        <button
          className={`complete-button ${plan.completed.includes(activeWeek) ? "completed" : ""}`}
          onClick={() => toggle(activeWeek)}
          aria-pressed={plan.completed.includes(activeWeek)}
        >
          {plan.completed.includes(activeWeek) ? (
            <CheckCircle2 size={19} />
          ) : (
            <Circle size={19} />
          )}{" "}
          {plan.completed.includes(activeWeek)
            ? "Step completed"
            : "Mark as complete"}
        </button>
      </div>
      <div className="roadmap-note">
        <span className="status-light" />{" "}
        {storageAvailable
          ? "Progress saved on this device"
          : "Progress kept for this visit"}{" "}
        <span className="note-divider">·</span> Your pace, your journey{" "}
        <ArrowRight size={14} />
      </div>
      <div className="sr-only" role="status">
        {notice}
      </div>
    </div>
  );
}

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { quizQuestions } from "../data";

export default function Quiz({ reducedMotion }) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [choice, setChoice] = useState(null);
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [review, setReview] = useState(false);
  const heading = useRef();
  const question = quizQuestions[index];
  const score = answers.reduce(
    (sum, answer, i) => sum + (answer === quizQuestions[i].correct ? 1 : 0),
    0,
  );
  const focusHeading = () => setTimeout(() => heading.current?.focus(), 60);
  const next = () => {
    if (index === quizQuestions.length - 1) {
      setFinished(true);
      focusHeading();
      return;
    }
    setIndex((i) => i + 1);
    setChoice(null);
    setChecked(false);
    focusHeading();
  };
  const check = () => {
    setChecked(true);
    setAnswers((a) => [...a, choice]);
  };
  const restart = () => {
    setIndex(0);
    setAnswers([]);
    setChoice(null);
    setChecked(false);
    setFinished(false);
    setReview(false);
    setStarted(true);
    focusHeading();
  };
  return (
    <div className={`quiz-shell ${started ? "quiz-started" : ""}`}>
      <div className="quiz-main">
        {!started ? (
          <div className="quiz-intro">
            <span className="eyebrow">
              <CircleHelp size={14} /> A QUICK MINDSET CHECK
            </span>
            <h3>
              Ready to test
              <br />
              your learning mindset?
            </h3>
            <p>
              Five questions. A few fresh ideas.
              <br />
              No pressure — just a chance to learn.
            </p>
            <button
              className="button button-primary"
              onClick={() => {
                setStarted(true);
                focusHeading();
              }}
            >
              Let’s try the quiz <ArrowRight size={17} />
            </button>
            <span className="quiz-time">
              5 questions <i /> About 2 minutes
            </span>
          </div>
        ) : finished ? (
          <div className="quiz-result">
            <div className="result-icon">
              <Trophy size={34} />
            </div>
            <span className="eyebrow">QUIZ COMPLETE</span>
            <h3 ref={heading} tabIndex={-1}>
              {score >= 4
                ? "A great learning mindset."
                : "Every answer is a new lesson."}
            </h3>
            <p>
              You got <strong>{score} out of 5</strong> right.{" "}
              {score >= 4
                ? "Take that curiosity into your next challenge."
                : "Keep the useful ideas and give it another try."}
            </p>
            <div className="result-actions">
              <button className="button button-primary" onClick={restart}>
                <RotateCcw size={16} /> Try again
              </button>
              <button
                className="button button-secondary"
                onClick={() => setReview((v) => !v)}
                aria-expanded={review}
              >
                {review ? "Hide answers" : "Review answers"}
              </button>
            </div>
            {review && (
              <div className="answer-review">
                {quizQuestions.map((q, i) => (
                  <div key={q.question}>
                    <span
                      className={
                        answers[i] === q.correct
                          ? "correct-text"
                          : "incorrect-text"
                      }
                    >
                      {answers[i] === q.correct ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <CircleHelp size={16} />
                      )}{" "}
                      Question {i + 1}
                    </span>
                    <h4>{q.question}</h4>
                    <p>
                      <strong>Best answer:</strong> {q.options[q.correct]}
                    </p>
                    <p>{q.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="quiz-question">
            <div className="question-top">
              <span className="eyebrow">
                QUESTION {String(index + 1).padStart(2, "0")} <span>/ 05</span>
              </span>
              <span className="quiz-score">{score} correct</span>
            </div>
            <div
              className="question-progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={5}
              aria-valuenow={index + 1}
              aria-label={`Question ${index + 1} of 5`}
            >
              {quizQuestions.map((_, i) => (
                <span className={i <= index ? "filled" : ""} key={i} />
              ))}
            </div>
            <h3 ref={heading} tabIndex={-1}>
              {question.question}
            </h3>
            <div
              className="answer-options"
              role="group"
              aria-label="Answer options"
            >
              {question.options.map((option, i) => (
                <button
                  key={option}
                  disabled={checked}
                  aria-pressed={choice === i}
                  className={`answer-option ${choice === i ? "selected" : ""} ${checked && i === question.correct ? "correct" : ""} ${checked && choice === i && i !== question.correct ? "incorrect" : ""}`}
                  onClick={() => setChoice(i)}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{option}</span>
                  {checked && i === question.correct ? (
                    <Check size={17} />
                  ) : checked && choice === i ? (
                    <X size={17} />
                  ) : null}
                </button>
              ))}
            </div>
            <AnimatePresence initial={false}>
              {checked && (
                <motion.div
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="quiz-feedback"
                  role="status"
                >
                  <strong>
                    {choice === question.correct
                      ? "Exactly right!"
                      : "A useful idea to remember."}
                  </strong>
                  <p>{question.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="quiz-footer">
              <span>
                {checked
                  ? "Small lessons make a difference."
                  : "Choose the answer that fits best."}
              </span>
              {checked ? (
                <button className="button button-primary" onClick={next}>
                  {index === 4 ? "See my results" : "Next question"}{" "}
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  className="button button-primary"
                  onClick={check}
                  disabled={choice === null}
                >
                  Check answer <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {!started && (
        <div className="quiz-art" aria-hidden="true">
          <div className="quiz-art-orbit" />
          <div className="quiz-art-orbit orbit-tilt" />
          <span className="quiz-art-star star-a">✦</span>
          <span className="quiz-art-star star-b">✧</span>
          <div className="question-cube">
            <span>?</span>
          </div>
          <div className="quiz-art-chip">
            <Sparkles size={13} /> CURIOUS MINDS WELCOME
          </div>
        </div>
      )}
    </div>
  );
}

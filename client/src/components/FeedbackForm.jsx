import { useState } from "react";
import { useForm } from "react-hook-form";
import { CATEGORIES } from "../constants/categories.js";
import { createFeedback } from "../api/feedbackApi.js";
import styles from "./FeedbackForm.module.css";

const FeedbackForm = ({ location, onSubmitted, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [submitError, setSubmitError] = useState(null);

  const onSubmit = async ({ category, comment }) => {
    setSubmitError(null);
    try {
      const feature = await createFeedback({
        category,
        comment,
        lat: location.lat,
        lng: location.lng,
      });
      onSubmitted(feature);
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <div>
      <button type="button" className={styles.link} onClick={onCancel}>
        ← Back to history
      </button>
      <h2>Add feedback</h2>
      <p className={styles.coords}>
        📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        <br />
        Click the map to move it
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className={styles.label}>
          Category
          <select
            className={styles.select}
            {...register("category", { required: "Choose a category" })}
          >
            <option value="">Choose a category…</option>
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        {errors.category && (
          <p className={styles.error}>{errors.category.message}</p>
        )}

        <label className={styles.label}>
          Comment
          <textarea
            {...register("comment", {
              validate: (value) => value.trim() !== "" || "Enter a comment",
              maxLength: { value: 1200, message: "Keep it under 1200 characters" },
            })}
            className={styles.input}
            placeholder="Enter your feedback here..."
          />
        </label>
        {errors.comment && (
          <p className={styles.error}>{errors.comment.message}</p>
        )}

        {submitError && (
          <p role="alert" className={styles.error}>
            Couldn't save: {submitError}
          </p>
        )}

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.primary}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Submit feedback"}
          </button>
          <button
            type="button"
            className={styles.secondary}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;

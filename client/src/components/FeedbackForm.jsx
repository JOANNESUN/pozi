import { useForm } from "react-hook-form";
import styles from "./FeedbackForm.module.css";

const FeedbackForm = ({ location }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log("Feedback submitted:", { ...data, ...location });
    reset();
  };

  return (
    <div>
      <h2>Feedback</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          {...register("comment", { required: true })}
          className={styles.input}
          placeholder="Enter your feedback here..."
        />
        <div className={styles.actions}>
          <button type="submit" className={styles.primary}>
            Submit Feedback
          </button>
          <button type="button" className={styles.secondary} onClick={() => reset()}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;

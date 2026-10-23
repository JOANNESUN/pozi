import { CATEGORIES, getCategory } from "../constants/categories.js";
import styles from "./FeedbackHistory.module.css";

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
  });

const FeedbackHistory = ({
  features,
  totalCount,
  isLoading,
  loadError,
  notice,
  categoryFilter,
  onCategoryFilterChange,
}) => {
  const newestFirst = [...features].sort((a, b) =>
    b.properties.created_at.localeCompare(a.properties.created_at),
  );

  return (
    <div className={styles.history}>
      <div className={styles.header}>
        <h2>Feedback history</h2>
        <span className={styles.count}>{totalCount}</span>
      </div>

      {notice && (
        <p role="status" className={styles.notice}>
          {notice}
        </p>
      )}

      <div
        className={styles.chips}
        role="group"
        aria-label="Filter by category"
      >
        {[{ value: "all", label: "All" }, ...CATEGORIES].map((category) => (
          <button
            key={category.value}
            type="button"
            className={styles.chip}
            aria-pressed={categoryFilter === category.value}
            onClick={() => onCategoryFilterChange(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {isLoading && <p className={styles.hint}>Loading feedback…</p>}
      {loadError && (
        <p role="alert" className={styles.error}>
          Couldn't load feedback: {loadError}
        </p>
      )}

      {!isLoading && !loadError && newestFirst.length === 0 && (
        <p className={styles.hint}>
          {totalCount === 0
            ? "No feedback yet. Be the first!"
            : "No feedback in this category."}
        </p>
      )}

      <ul className={styles.list}>
        {newestFirst.map(({ properties }) => {
          const category = getCategory(properties.category);
          return (
            <li key={properties.id} className={styles.item}>
              <div className={styles.itemHeader}>
                <span
                  className={styles.dot}
                  style={{ background: category.color }}
                  aria-hidden="true"
                />
                <span className={styles.itemLabel}>{category.label}</span>
                <time className={styles.date} dateTime={properties.created_at}>
                  {formatDate(properties.created_at)}
                </time>
              </div>
              <p className={styles.comment}>{properties.comment}</p>
            </li>
          );
        })}
      </ul>

      <div className={styles.footer}>
        <p className={styles.hint}>
          📍 Click anywhere on the map to add feedback
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.secondary} disabled>
            Import GeoJSON
          </button>
          <button type="button" className={styles.secondary} disabled>
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackHistory;

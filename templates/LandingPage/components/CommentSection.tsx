import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  CSSProperties,
  JSX,
} from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { FaStar, FaSpinner } from "react-icons/fa";

interface Comment {
  _id: string;
  name: string;
  message: string;
  rating: number;
  createdAt: string;
}

interface AverageRating {
  value: number;
  total: number;
}

interface FormData {
  name: string;
  message: string;
  rating: number;
}

export default function CommentSection() {
  const { theme } = useTheme();
  const [comments, setComments] = useState<Comment[]>([]);
  const [form, setForm] = useState<FormData>({
    name: "",
    message: "",
    rating: 0,
  });
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [averageRating, setAverageRating] = useState<AverageRating | null>(
    null
  );

  // warna berdasarkan tema
  const colors = {
    bgPage: theme === "light" ? "#F3F4F6" : "#111827",
    bgCard: theme === "light" ? "#FFFFFF" : "#1F2937",
    bgComment: theme === "light" ? "#F9FAFB" : "#374151",
    border: theme === "light" ? "#D1D5DB" : "#4B5563",
    text: theme === "light" ? "#111827" : "#F9FAFB",
    textSecondary: theme === "light" ? "#6B7280" : "#D1D5DB",
    textMuted: theme === "light" ? "#4B5563" : "#9CA3AF",
    btnBg: theme === "light" ? "#2563EB" : "#3B82F6",
    btnBgHover: theme === "light" ? "#1D4ED8" : "#2563EB",
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/comments/get");
      const data = await res.json();
      const dataComments: Comment[] = data.comments;
      const apiAvg: number = data.averageRating;
      const apiTotal: number = data.totalRatings;
      setComments(dataComments);
      setAverageRating({ value: apiAvg, total: apiTotal });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.rating === 0) {
      alert("Pilih rating dulu, ya!");
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/comments/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ name: "", message: "", rating: 0 });
      setHoverRating(0);
      await fetchComments();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const starStyle = (active: boolean): CSSProperties => ({
    cursor: "pointer",
    color: active ? "#FBBF24" : colors.textMuted,
    transform: active ? "scale(1.1)" : "scale(1)",
    transition: "transform 0.15s, color 0.15s",
  });

  const renderStars = (
    currentRating: number,
    onClick: (rating: number) => void,
    onMouseEnter: (rating: number) => void,
    onMouseLeave: () => void
  ): JSX.Element => (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i: number) => {
        const active = i <= (hoverRating || currentRating);
        return (
          <FaStar
            key={i}
            size={24}
            style={starStyle(active)}
            onClick={() => onClick(i)}
            onMouseEnter={() => onMouseEnter(i)}
            onMouseLeave={onMouseLeave}
          />
        );
      })}
    </div>
  );

  return (
    <div
      style={{
        background: colors.bgPage,
        minHeight: "100vh",
        padding: "2rem 1rem",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 24,
          color: colors.text,
        }}
      >
        Komentar Pengunjung
      </h2>

      {averageRating && (
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <p style={{ fontSize: 18, fontWeight: 500, color: colors.textMuted }}>
            Rata-rata Rating
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              marginTop: 4,
            }}
          >
            {renderStars(
              Math.round(averageRating.value),
              () => {},
              () => {},
              () => {}
            )}
            <span style={{ marginLeft: 8, color: colors.textSecondary }}>
              ({averageRating.total} pengguna)
            </span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: colors.bgCard,
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          marginBottom: 32,
        }}
      >
        <input
          type="text"
          placeholder="Nama Anda"
          value={form.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, name: e.target.value })
          }
          required
          style={{
            width: "100%",
            padding: 12,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            marginBottom: 16,
            outline: "none",
            background: theme === "light" ? "#FFF" : "#111827",
            color: colors.text,
          }}
        />

        <textarea
          placeholder="Tulis komentar..."
          value={form.message}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setForm({ ...form, message: e.target.value })
          }
          required
          style={{
            width: "100%",
            padding: 12,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            marginBottom: 16,
            outline: "none",
            background: theme === "light" ? "#FFF" : "#111827",
            color: colors.text,
            resize: "vertical",
            minHeight: 100,
          }}
        />

        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8, fontWeight: 500, color: colors.text }}>
            Beri Rating:
          </p>
          {renderStars(
            form.rating,
            (rating: number) => setForm({ ...form, rating }),
            (i: number) => setHoverRating(i),
            () => setHoverRating(0)
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 12,
            background: colors.btnBg,
            color: "#FFFFFF",
            fontWeight: 600,
            border: "none",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = colors.btnBgHover)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = colors.btnBg)
          }
        >
          {loading ? (
            <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            "Kirim Komentar"
          )}
        </button>

        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {comments.map((comment: Comment) => (
          <div
            key={comment._id}
            style={{
              background: colors.bgComment,
              padding: 20,
              borderRadius: 10,
              boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <p style={{ fontWeight: 600, color: colors.text }}>
                {comment.name}
              </p>
              <span style={{ fontSize: 12, color: colors.textSecondary }}>
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            {comment.rating > 0 && (
              <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                {Array.from({ length: comment.rating }).map((_, i: number) => (
                  <FaStar key={i} size={16} style={{ color: "#FBBF24" }} />
                ))}
              </div>
            )}
            <p style={{ color: colors.text }}>{comment.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

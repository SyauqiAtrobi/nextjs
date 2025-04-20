"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { FaStar, FaSpinner } from "react-icons/fa";

export default function CommentSection() {
  const { theme } = useTheme();
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: "", message: "", rating: 0 });
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(null);

  // warna berdasarkan tema
  const colors = {
    bgPage: theme === "light" ? "#F3F4F6" : "#111827", // gray-100 / gray-900
    bgCard: theme === "light" ? "#FFFFFF" : "#1F2937", // white / gray-800
    bgComment: theme === "light" ? "#F9FAFB" : "#374151", // gray-50 / gray-700
    border: theme === "light" ? "#D1D5DB" : "#4B5563", // gray-300 / gray-600
    text: theme === "light" ? "#111827" : "#F9FAFB", // gray-900 / gray-50
    textSecondary: theme === "light" ? "#6B7280" : "#D1D5DB", // gray-500 / gray-400
    textMuted: theme === "light" ? "#4B5563" : "#9CA3AF", // gray-700 / gray-400
    btnBg: theme === "light" ? "#2563EB" : "#3B82F6", // blue-600 / blue-500
    btnBgHover: theme === "light" ? "#1D4ED8" : "#2563EB", // blue-700 / blue-600
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/comments/get");
      const {
        comments: dataComments,
        averageRating,
        totalRatings,
      } = await res.json();
      if (Array.isArray(dataComments)) {
        setComments(dataComments);
        setAverageRating({ value: averageRating, total: totalRatings });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) return alert("Pilih rating dulu, ya!");
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

  // style bintang manual
  const starStyle = (active) => ({
    cursor: "pointer",
    color: active ? "#FBBF24" : colors.textMuted,
    transform: active ? "scale(1.1)" : "scale(1)",
    transition: "transform 0.15s, color 0.15s",
  });

  const renderStars = (currentRating, onClick, onMouseEnter, onMouseLeave) => (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => {
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
          onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          onChange={(e) => setForm({ ...form, message: e.target.value })}
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
            (rating) => setForm({ ...form, rating }),
            (i) => setHoverRating(i),
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
        {comments.map((comment) => (
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
                {Array.from({ length: comment.rating }).map((_, i) => (
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

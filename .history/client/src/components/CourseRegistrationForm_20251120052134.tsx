import { useState } from "react";
import { trpcClient } from "@/lib/trpc";

interface CourseRegistrationFormProps {
  courseName?: string;
  onSuccess?: (accessKey: string) => void;
}

export function CourseRegistrationForm({
  courseName = "Gratis Mini-Kurs",
  onSuccess,
}: CourseRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const result = await trpcClient.course.register.mutate({
        name: formData.name,
        email: formData.email,
        courseName: "free-mini-course",
      });

      if (result.success) {
        setStatus({
          type: "success",
          message: `✅ ${result.message}. Bitte überprüfe dein Postfach!`,
        });
        setFormData({ name: "", email: "" });
        onSuccess?.(result.accessKey || "");
      } else {
        setStatus({
          type: "error",
          message: `❌ ${result.message || result.error}`,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setStatus({
        type: "error",
        message: "❌ Ein Fehler ist aufgetreten. Bitte versuche es später.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg border border-cyan-200 shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        🎓 {courseName}
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        Kostenloser Zugang mit persönlichem Zugriffsschlüssel
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Dein Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Max Mustermann"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-Mail Adresse
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="max@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {status.type && (
          <div
            className={`p-3 rounded-md text-sm ${
              status.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-md transition duration-200"
        >
          {loading ? "⏳ Wird angemeldet..." : "✅ Kostenlos Anmelden"}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        💌 Du erhältst sofort eine E-Mail mit deinem persönlichen Zugriffsschlüssel
      </p>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { X, Download, Share2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";
import { CourseModule } from "@/data/courseData";

interface CourseModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: CourseModule | null;
  canAccess: boolean;
  userTier?: "starter" | "professional" | "enterprise" | null;
}

const CourseModuleModal: React.FC<CourseModuleModalProps> = ({
  isOpen,
  onClose,
  module,
  canAccess,
  userTier,
}) => {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && module && canAccess) {
      loadModuleContent();
    }
  }, [isOpen, module, canAccess]);

  const loadModuleContent = async () => {
    if (!module) return;
    setIsLoading(true);
    try {
      const response = await fetch(module.contentFile);
      if (response.ok) {
        const text = await response.text();
        setContent(text);
      } else {
        setContent(
          "# Fehler beim Laden\n\nDer Modulinhalt konnte nicht geladen werden."
        );
      }
    } catch (error) {
      console.error("Failed to load module content:", error);
      setContent(
        "# Fehler beim Laden\n\nEs gab ein Problem beim Laden des Inhalts."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !module) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{module.title}</h2>
            <p className="text-sm text-gray-400 mt-1">⏱️ {module.duration}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-4"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!canAccess ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Lock size={48} className="text-cyan-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Modul gesperrt
              </h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Dieses Modul ist im Tier{" "}
                <strong>{module.tier.toUpperCase()}</strong> enthalten. Bitte
                upgraden Sie Ihren Kurs, um Zugriff zu erhalten.
              </p>
              <Button className="bg-cyan-500 hover:bg-cyan-400 text-white">
                Zum Kurs upgraden
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
                <p className="text-gray-300">Modul wird geladen...</p>
              </div>
            </div>
          ) : (
            <article className="prose prose-invert max-w-none">
              <Streamdown>{content}</Streamdown>
            </article>
          )}
        </div>

        {/* Footer */}
        {canAccess && (
          <div className="border-t border-gray-800 p-6 flex-shrink-0 bg-gray-800/50 flex items-center justify-between">
            <p className="text-sm text-gray-400">Modul: {module.title}</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const element = document.createElement("a");
                  const file = new Blob([content], { type: "text/markdown" });
                  element.href = URL.createObjectURL(file);
                  element.download = `${module.title}.md`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                className="gap-2"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: module.title,
                      text: `Schau dir dieses KI-Modul an: ${module.title}`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="gap-2"
              >
                <Share2 size={16} />
                <span className="hidden sm:inline">Teilen</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseModuleModal;

import React, { useState } from "react";
import { Lock, Play, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseModuleModal from "@/components/CourseModuleModal";
import {
  courseModules,
  getModulesByTier,
  canAccessModule,
  CourseModule,
} from "@/data/courseData";

interface CourseModulesPreviewProps {
  tier: "starter" | "professional" | "enterprise";
  userTier?: "starter" | "professional" | "enterprise" | null;
  onUpgrade?: () => void;
}

const CourseModulesPreview: React.FC<CourseModulesPreviewProps> = ({
  tier,
  userTier,
  onUpgrade,
}) => {
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modules = getModulesByTier(tier);
  const isOwner =
    userTier === tier || (userTier === "enterprise" && tier !== "enterprise");
  const safeTier = userTier ?? null;

  const handleModuleClick = (module: CourseModule) => {
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-3">
        <h3 className="font-semibold text-white mb-4">
          📚 Kursmodule ({modules.length})
        </h3>
        <div className="space-y-2">
          {modules.map(module => {
            const hasAccess = isOwner || canAccessModule(module.id, safeTier);
            return (
              <button
                key={module.id}
                onClick={() => hasAccess && handleModuleClick(module)}
                disabled={!hasAccess}
                className={`w-full p-4 rounded-lg border transition-all text-left group ${
                  hasAccess
                    ? "border-gray-700 bg-gray-800/50 hover:border-cyan-500/50 hover:bg-gray-800 cursor-pointer"
                    : "border-gray-700/50 bg-gray-900/50 cursor-not-allowed opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {hasAccess ? (
                        <Play
                          size={16}
                          className="text-cyan-400 flex-shrink-0"
                        />
                      ) : (
                        <Lock
                          size={16}
                          className="text-gray-500 flex-shrink-0"
                        />
                      )}
                      <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                        {module.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      {module.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>⏱️ {module.duration}</span>
                      {!hasAccess && (
                        <span className="text-orange-400">
                          • Tier: {module.tier.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  {hasAccess && (
                    <ChevronRight
                      size={20}
                      className="text-gray-500 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {!isOwner && userTier && userTier !== tier && (
          <div className="mt-4 p-3 bg-orange-900/20 border border-orange-500/50 rounded-lg">
            <p className="text-sm text-orange-100">
              🔒 Einige Module sind im <strong>{tier.toUpperCase()}</strong>
              -Plan enthalten.
            </p>
            {onUpgrade && (
              <Button
                size="sm"
                onClick={onUpgrade}
                className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                Jetzt upgraden
              </Button>
            )}
          </div>
        )}
      </div>

      <CourseModuleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedModule(null);
        }}
        module={selectedModule}
        canAccess={
          selectedModule
            ? isOwner || canAccessModule(selectedModule.id, safeTier)
            : false
        }
        userTier={userTier}
      />
    </>
  );
};

export default CourseModulesPreview;

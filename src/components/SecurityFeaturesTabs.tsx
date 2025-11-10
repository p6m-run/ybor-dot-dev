import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import type { ProcessedComponent } from "@/types/contentful-v2";
import { cn } from "@/lib/utils";

interface UseCasesTabsProps {
  useCases: ProcessedComponent[];
  color: string;
  slug: string;
}

export default function UseCasesTabs({
  useCases,
  color,
  slug,
}: UseCasesTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!useCases || useCases.length === 0) {
    return null;
  }

  const activeUseCase = useCases[activeTab];

  return (
    <div className="grid md:grid-cols-[340px_1fr] gap-8">
      {/* Left sidebar - Vertical tabs */}
      <div className="space-y-2">
        {useCases.map((useCase, index) => (
          <button
            key={useCase.id}
            onClick={() => setActiveTab(index)}
            className={cn("w-full text-left px-5 py-3 rounded-lg font-medium transition-all flex items-center justify-between group", {
              "bg-transparent text-white/50 hover:bg-black/20": activeTab !== index,
              "bg-brand-yellow/25": activeTab === index && color === "brand-yellow",
              "bg-brand-blue/25": activeTab === index && color === "brand-blue",
              "bg-brand-orange/25": activeTab === index && color === "brand-orange",
              "bg-brand-purple/25": activeTab === index && color === "brand-purple",
              "bg-brand-green/25": activeTab === index && color === "brand-green",
            })}
          >
            <span>{useCase.title}</span>
          </button>
        ))}
      </div>

      {/* Right content area */}
      <div className="lg:px-8 lg:py-4">
        {activeUseCase.subtitle && (
          <p className="text-xl text-gray-700 mb-4 font-medium">
            {activeUseCase.subtitle}
          </p>
        )}

        {activeUseCase.description && (
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            {activeUseCase.image && (
              <img
                src={activeUseCase.image.url}
                alt={activeUseCase.image.alt || activeUseCase.title || ""}
                className="w-auto h-23 rounded-lg"
              />
            )}
            <div
              className="text-sm text-white font-mono mb-6 prose prose-sm max-w-none space-y-4"
              dangerouslySetInnerHTML={{
                __html:
                  typeof activeUseCase.description === "string"
                    ? activeUseCase.description
                    : documentToHtmlString(activeUseCase.description),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

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
            className={`
              w-full text-left px-5 py-3 rounded-lg font-medium transition-all
              flex items-center justify-between group
              ${
                activeTab === index
                  ? "bg-black border border-brand-stroke text-white"
                  : "bg-transparent text-white opacity-50 hover:bg-black"
              }
            `}
          >
            <span>{useCase.title}</span>
            {activeTab === index && (
              <ArrowRight
                className={cn("w-4 h-4", {
                  "text-brand-yellow": color === "brand-yellow",
                  "text-brand-blue": color === "brand-blue",
                  "text-brand-orange": color === "brand-orange",
                  "text-brand-purple": color === "brand-purple",
                  "text-brand-green": color === "brand-green",
                })}
              />
            )}
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

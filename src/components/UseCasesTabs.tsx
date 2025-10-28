import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { ProcessedComponent } from "@/types/contentful-v2";
import { cn } from "@/lib/utils";
import he from 'he';

interface UseCasesTabsProps {
  useCases: ProcessedComponent[];
  color: string;
}

const options = {
  renderText: (text: string) => he.decode(text),
};

export default function UseCasesTabs({ useCases, color }: UseCasesTabsProps) {
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
                  ? "bg-gray-900 text-white"
                  : "bg-transparent text-gray-700 hover:bg-gray-100"
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

        {/* CTA Section */}
        <div className="mt-8 border border-gray-900 bg-background rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-4 font-mono">
            Have more specific needs?
            <br />
            Talk to our team today
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 h-10 px-6 py-2"
          >
            Get In Touch
            <ArrowRight
              className={cn("w-4 h-4 ml-2", {
                "text-brand-yellow": color === "brand-yellow",
                "text-brand-blue": color === "brand-blue",
                "text-brand-orange": color === "brand-orange",
                "text-brand-purple": color === "brand-purple",
                "text-brand-green": color === "brand-green",
              })}
            />
          </a>
        </div>
      </div>

      {/* Right content area */}
      <div className="border border-gray-900 bg-background rounded-lg p-12">
        {activeUseCase.subtitle && (
          <p className="text-2xl text-gray-700 mb-4 font-medium">
            {activeUseCase.subtitle}
          </p>
        )}

        {activeUseCase.description && (
          <div
            className="text-sm text-gray-600 font-mono mb-6 prose prose-sm max-w-none space-y-4">
              {documentToReactComponents(activeUseCase.description, options)}
            </div>
        )}

        {activeUseCase.image && (
          <div className="flex justify-center mt-12">
            <img
              src={activeUseCase.image.url}
              alt={activeUseCase.image.alt || activeUseCase.title || ""}
              className="w-auto h-56 animate-fade animate-once animate-duration-[250ms] animate-delay-100"
            />
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { ArrowRight, ArrowRightCircleIcon } from "lucide-react";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { ProcessedComponent } from "@/types/contentful-v2";
import { cn } from "@/lib/utils";
import he from 'he';
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

interface UseCasesTabsProps {
  useCases: ProcessedComponent[];
  color: string;
  showCta?: boolean;
}

const options = {
  renderText: (text: string) => he.decode(text),
};

const Cta = ({ color, className }: { color: string, className?: string }) => {
  return (
    <div className={cn("mt-8 border border-gray-900 bg-background rounded-lg p-6", className)}>
          <p className="text-sm text-gray-600 mb-4 font-mono">
            Have more specific needs?
            <br />
            Talk to our team today
          </p>
          <a
            href="/contact"
            className={cn("inline-flex items-center group justify-center rounded-full text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 h-10 px-6 py-2 transition-colors duration-300 ease-in-out", {
              "hover:bg-brand-purple": color === "brand-purple",
              "hover:bg-brand-blue": color === "brand-blue",
              "hover:bg-brand-orange hover:text-black": color === "brand-orange",
              "hover:bg-brand-yellow hover:text-black": color === "brand-yellow",
              "hover:bg-brand-green hover:text-black": color === "brand-green",
            })
            }
          >
            Get In Touch
            <ArrowRightCircleIcon
                  className={cn("", {
                    "w-5 h-5 ml-4 text-brand-purple group-hover:text-white": color === "brand-purple",
                    "w-5 h-5 ml-4 text-brand-blue group-hover:text-white": color === "brand-blue",
                    "w-5 h-5 ml-4 text-brand-orange group-hover:text-black": color === "brand-orange",
                    "w-5 h-5 ml-4 text-brand-yellow group-hover:text-black": color === "brand-yellow",
                    "w-5 h-5 ml-4 text-brand-green group-hover:text-black": color === "brand-green",
                  })}
                />
          </a>
        </div>
  );
};

export default function UseCasesTabs({ useCases, color, showCta = true }: UseCasesTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!useCases || useCases.length === 0) {
    return null;
  }

  const activeUseCase = useCases[activeTab];

  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-8">
      {/* Left sidebar - Vertical tabs */}
      <div className="space-y-2">
        {useCases.map((useCase, index) => (
          <button
            key={useCase.id}
            onClick={() => setActiveTab(index)}
            className={cn("w-full text-left px-5 py-3 rounded-lg font-medium transition-all flex items-center justify-between group", {
              "bg-transparent text-gray-700 hover:bg-gray-100": activeTab !== index,
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

        {/* CTA Section */}
        {showCta && (
        <Cta color={color} className="hidden lg:block" />
        )}
      </div>

      {/* Right content area */}
      <div className="lg:border border-gray-900 lg:bg-background rounded-lg p-0 lg:p-12">
        {activeUseCase.subtitle && (
          <p className="text-2xl text-gray-700 mb-4 font-medium">
            {activeUseCase.subtitle}
          </p>
        )}

        {activeUseCase.description && (
          <div
            className="text-sm text-gray-600 font-mono mb-6 prose prose-sm max-w-none space-y-4"
        >
          {documentToReactComponents(activeUseCase.description, options)}
        </div>
        )}

        {activeUseCase.image && (
          <div className="flex justify-center mt-12">
            <img
              src={activeUseCase.image.url}
              alt={activeUseCase.image.alt || activeUseCase.title || ""}
              className="w-auto lg:h-56 animate-fade animate-once animate-duration-[250ms] animate-delay-100"
            />
          </div>
        )}
      </div>

      {/* CTA Section */}
      {showCta && (
        <Cta color={color} className="block lg:hidden" />
        )}
    </div>
  );
}

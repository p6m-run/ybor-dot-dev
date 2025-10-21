import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import type { ProcessedComponent } from '@/types/contentful-v2';
import { decodeHtmlEntities } from '@/lib/utils';

interface UseCasesTabsProps {
  useCases: ProcessedComponent[];
}

export default function UseCasesTabs({ useCases }: UseCasesTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!useCases || useCases.length === 0) {
    return null;
  }

  const activeUseCase = useCases[activeTab];

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-8">
      {/* Left sidebar - Vertical tabs */}
      <div className="space-y-2">
        {useCases.map((useCase, index) => (
          <button
            key={useCase.id}
            onClick={() => setActiveTab(index)}
            className={`
              w-full text-left px-6 py-4 rounded-lg font-medium transition-all
              flex items-center justify-between group
              ${
                activeTab === index
                  ? 'bg-gray-900 text-white'
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <span>{useCase.title}</span>
            {activeTab === index && (
              <ArrowRight className="w-4 h-4 text-brand-yellow" />
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
            <ArrowRight className="w-4 h-4 ml-2 text-brand-yellow" />
          </a>
        </div>
      </div>

      {/* Right content area */}
      <div className="border border-gray-200 rounded-lg p-8">

        {activeUseCase.subtitle && (
          <p className="text-xl text-gray-700 mb-4 font-medium">
            {activeUseCase.subtitle}
          </p>
        )}

        {activeUseCase.description && (
          <div
            className="text-sm text-gray-600 font-mono mb-6 prose prose-sm max-w-none space-y-4"
            dangerouslySetInnerHTML={{
              __html: decodeHtmlEntities(
                typeof activeUseCase.description === 'string'
                  ? activeUseCase.description
                  : documentToHtmlString(activeUseCase.description)
              ),
            }}
          />
        )}

        {activeUseCase.image && (
          <div className="mt-6">
            <img
              src={activeUseCase.image.url}
              alt={activeUseCase.image.alt || activeUseCase.title || ''}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}


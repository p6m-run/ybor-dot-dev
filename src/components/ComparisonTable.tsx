import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import YedeLogo from "@/assets/y-ede-logo.svg";
import YInfraLogo from "@/assets/y-infra-logo.svg";

interface ComparisonTableProps {
  metadata: {
    "Feature Comparison": {
      [categoryName: string]: {
        [featureName: string]: {
          [competitorName: string]: boolean | null;
        };
      };
    };
  };
  highlightColumn?: number; // Index of column to highlight (typically EDE)
  slug: string;
  color: string;
}

const StatusIcon = ({ status }: { status: boolean | null }) => {
  if (status === true) {
    return <CheckCircle2 className="w-5 h-5 text-green-500" />;
  } else if (status === false) {
    return <XCircle className="w-5 h-5 text-red-500" />;
  } else if (status === null) {
    return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
  }
  return null;
};

export default function ComparisonTable({
  metadata,
  highlightColumn = 0,
  slug,
  color,
}: ComparisonTableProps) {
  if (!metadata || !metadata["Feature Comparison"]) {
    return <div className="text-gray-500">No comparison data available</div>;
  }

  const renderLogo = (competitor: string) => {
    switch (competitor as string) {
      case "EDE":
        return (
          <div className="flex items-center justify-center gap-2">
            <img src={YedeLogo.src} alt="EDE" className="w-auto h-6" />
          </div>
        );
      case "INFRA":
        return (
          <div className="flex items-center justify-center gap-2">
            <img src={YInfraLogo.src} alt="Infra" className="w-auto h-6" />
          </div>
        );
      default:
        return competitor;
    }
  };

  const featureComparison = metadata["Feature Comparison"];

  // Extract competitors from the first feature of the first category
  const firstCategory = Object.values(featureComparison)[0];
  const firstFeature = Object.values(firstCategory)[0];
  const competitors = Object.keys(firstFeature);

  // Parse categories and features
  const categories = Object.entries(featureComparison).map(
    ([categoryName, features]) => ({
      name: categoryName,
      features: Object.entries(features).map(
        ([featureName, competitorData]) => ({
          name: featureName,
          support: competitors.map((competitor) => competitorData[competitor]),
        })
      ),
    })
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-900">
            <th className="text-left py-4 px-6 font-medium text-sm text-gray-600 uppercase tracking-wide">
              Feature
            </th>
            {competitors.map((competitor, index) => (
              <th
                key={competitor}
                className={`text-center py-4 px-6 font-semibold ${
                  index === highlightColumn ? "bg-green-100" : ""
                }`}
              >
                {renderLogo(competitor)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((category, categoryIndex) => (
            <>
              {/* Category Header Row */}
              <tr key={`category-${categoryIndex}`} className="bg-gray-50">
                <td
                  colSpan={competitors.length + 1}
                  className="py-3 px-6 font-bold text-xs text-gray-700 uppercase tracking-wider"
                >
                  {category.name}
                </td>
              </tr>
              {/* Feature Rows */}
              {category.features.map((feature, featureIndex) => (
                <tr
                  key={`feature-${categoryIndex}-${featureIndex}`}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {feature.name}
                  </td>
                  {feature.support.map((status, competitorIndex) => (
                    <td
                      key={`status-${categoryIndex}-${featureIndex}-${competitorIndex}`}
                      className={`py-4 px-6 text-center ${
                        competitorIndex === highlightColumn
                          ? "bg-green-100"
                          : ""
                      }`}
                    >
                      <div className="flex justify-center">
                        <StatusIcon status={status} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

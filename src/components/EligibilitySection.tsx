
import { CheckCircle } from 'lucide-react';

const EligibilitySection = () => {
  return (
    <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Qualifying Criteria
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          'Respiratory Conditions',
          'Cardiovascular Conditions',
          'Limited Mobility',
          'Cancer Treatment/Diagnosis',
          'Autoimmune Conditions',
          'Over 65 years of age',
          'On Benefits',
          'Income below £31,000 per year',
          'Children under 5 years of age'
        ].map((condition, index) => (
          <div key={index} className="flex items-center justify-start space-x-3 p-2">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span className="text-gray-700">{condition}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EligibilitySection;

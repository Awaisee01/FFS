
const ProcessSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {[
        { step: "1", title: "Free Assessment", description: "We assess your property's solar potential and eligibility for funding schemes." },
        { step: "2", title: "Modelling", description: "Your property's energy requirement will be assessed and layout of panels will be determined." },
        { step: "3", title: "Approval & Planning", description: "We handle all paperwork, permits, and planning permissions required." },
        { step: "4", title: "Professional Installation", description: "Certified installers complete your solar installation in 1-2 days." }
      ].map((process, index) => (
        <div key={index} className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">{process.step}</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {process.title}
          </h3>
          <p className="text-gray-600">
            {process.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProcessSection;

const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="p-6 bg-blue-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export const Features = () => {
  const features = [
    {
      title: "Content Creation",
      description: "Generate informative and engaging content for various purposes.",
    },
    {
      title: "Blog Post Generation",
      description: "Create engaging blog posts in minutes with AI-powered writing tools.",
    },
    {
      title: "SEO Optimization",
      description: "Boost your content’s visibility with AI-driven SEO suggestions.",
    },
    {
      title: "Dialogue Generation",
      description: "Create realistic conversations between characters with distinct voices.",
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 transition-opacity duration-700 ease-out">
        Why Choose Our AI?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}
const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}

export const Features = () => {
  const features = [
    {
      title: "Content Creation",
      description: "Generate informative and engaging content for blogs, websites, and marketing materials.",
    },
    {
      title: "Blog Post Generation",
      description: "Create SEO-optimized blog posts in minutes with AI-powered research and structuring.",
    },
    {
      title: "SEO Optimization",
      description: "Boost your content's visibility with AI-driven keyword optimization and semantic analysis.",
    },
    {
      title: "Dialogue Generation",
      description: "Create realistic character dialogues for scripts, games, and conversational AI.",
    },
    {
      title: "Social Media Content",
      description: "Generate platform-specific posts with trending hashtags and engagement hooks.",
    },
    {
      title: "Content Repurposing",
      description: "Transform long-form content into social snippets, emails, and presentations.",
    },
    {
      title: "Brand Voice Customization",
      description: "Maintain consistent brand tone across all generated content.",
    },
    {
      title: "AI Image Generation",
      description: "Create custom visuals to accompany your content with text-to-image AI. (Upcoming)",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Powerful AI Content Capabilities
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Our AI-powered platform helps you create, optimize, and distribute content that resonates with your audience
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
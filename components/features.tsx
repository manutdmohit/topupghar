import { Clock, Shield, Users, Zap } from 'lucide-react';
import { FeatureCard } from './feature-card';

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Instant Delivery',
    description: 'Get your gaming credits delivered instantly to your account',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: '100% Secure',
    description: 'All transactions are protected with bank-level security',
    color: 'from-green-400 to-emerald-500',
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: '24/7 Support',
    description: 'Round-the-clock customer support for all your needs',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Trusted by Millions',
    description: 'Over 2 million satisfied gamers worldwide',
    color: 'from-purple-400 to-pink-500',
  },
];

const FeatureSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Why Choose Topup घर?
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We provide the most reliable and secure platform for all your gaming
          needs
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;

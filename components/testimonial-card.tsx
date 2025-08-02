'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  game?: string;
}

export function TestimonialCard({
  name,
  avatar,
  rating,
  comment,
  game,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        {/* Rating */}
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Comment */}
        <p className=" min-h-24 text-gray-700 mb-6 leading-relaxed italic text-xs">
          "{comment}"
        </p>

        {/* User info */}
        <div className="flex items-center">
          <div className="relative">
            <Image
              src={avatar || '/placeholder.svg'}
              alt={name}
              width={60}
              height={60}
              className="rounded-full object-cover border-4 border-purple-100"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div className="ml-4">
            <h4 className="font-bold text-gray-800 text-lg">{name}</h4>
            <p className="text-purple-600 font-medium">{game}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
}

const DEFAULT_CREW: CrewMember[] = [
  {
    id: 'crew_1',
    name: 'Reza Falevi',
    role: 'Founder & CEO',
    image: '/crew/behindTheCrib.jpeg',
    bio: 'Crafting the distinct Crib taste and curating single-origin beans with precision roast profiles.',
  },
  {
    id: 'crew_2',
    name: 'Lisa Anderson',
    role: 'CASHIER, MARKETING COMMUNITY',
    image: '/crew/behindTheCrib.jpeg',
    bio: 'Bridging coffee culture and youth creativity for all homies across the city.',
  },
  {
    id: 'crew_3',
    name: 'Farhan',
    role: 'HEAD BARISTA & FLAVOR SPECIALIST',
    image: '/crew/behindTheCrib.jpeg',
    bio: 'Perfecting espresso extraction, milk velvety texture, and signature drink development.',
  },
  {
    id: 'crew_4',
    name: 'Dimas Pratama',
    role: 'BARISTA, EVENT ORGANIZER',
    image: '/crew/behindTheCrib.jpeg',
    bio: 'Ensuring lightning-fast counter service and welcoming vibes for every walk-in customer.',
  },
  {
    id: 'crew_5',
    name: 'Kevin Jonathan',
    role: 'CULINARY & COMFORT FOOD LEAD',
    image: '/crew/behindTheCrib.jpeg',
    bio: 'Creating savory rice bowls, platters, and snacks tailored for coffee pairing.',
  },
];

interface BehindCribCarouselProps {
  members?: CrewMember[];
}

export const BehindCribCarousel: React.FC<BehindCribCarouselProps> = ({
  members = DEFAULT_CREW,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = members.length;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Auto-play feature
  useEffect(() => {
    if (isPaused || total <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, total, currentIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Calculate position class / style for each card
  const getCardStyle = (index: number) => {
    const offset = (index - currentIndex + total) % total;

    if (offset === 0) {
      // Center
      return {
        className: 'z-30 opacity-100 scale-100 shadow-2xl shadow-brand-red/20 ring-2 ring-brand-red/50 grayscale-0 cursor-default pointer-events-auto',
        transform: 'translateX(0%) scale(1) translateZ(0px)',
      };
    } else if (offset === 1) {
      // Right 1
      return {
        className: 'z-20 opacity-75 scale-90 grayscale-[70%] hover:grayscale-0 hover:opacity-90 cursor-pointer pointer-events-auto',
        transform: 'translateX(55%) scale(0.85) translateZ(-50px) rotateY(-8deg)',
      };
    } else if (offset === 2) {
      // Right 2
      return {
        className: 'z-10 opacity-35 scale-75 grayscale hover:opacity-60 cursor-pointer pointer-events-auto',
        transform: 'translateX(105%) scale(0.7) translateZ(-100px) rotateY(-15deg)',
      };
    } else if (offset === total - 1) {
      // Left 1
      return {
        className: 'z-20 opacity-75 scale-90 grayscale-[70%] hover:grayscale-0 hover:opacity-90 cursor-pointer pointer-events-auto',
        transform: 'translateX(-55%) scale(0.85) translateZ(-50px) rotateY(8deg)',
      };
    } else if (offset === total - 2) {
      // Left 2
      return {
        className: 'z-10 opacity-35 scale-75 grayscale hover:opacity-60 cursor-pointer pointer-events-auto',
        transform: 'translateX(-105%) scale(0.7) translateZ(-100px) rotateY(15deg)',
      };
    } else {
      // Hidden
      return {
        className: 'z-0 opacity-0 scale-50 pointer-events-none',
        transform: 'translateX(0%) scale(0.5) translateZ(-200px)',
      };
    }
  };

  const currentMember = members[currentIndex];

  return (
    <div
      className="w-full flex flex-col items-center justify-center py-6 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Title Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-white to-brand-white/70 uppercase">
          OUR TEAM
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-brand-red tracking-widest uppercase mt-2">
          THE FACES BEHIND CRIB SOCIETY COFFEE
        </p>
      </div>

      {/* 3D Carousel Container */}
      <div className="relative w-full max-w-5xl h-[340px] sm:h-[400px] md:h-[450px] flex items-center justify-center overflow-hidden [perspective:1000px] px-4">
        {/* Left Navigation Arrow */}
        <button
          onClick={handlePrev}
          aria-label="Previous team member"
          className="absolute left-2 sm:left-4 md:left-8 z-40 p-2.5 sm:p-3 rounded-full bg-brand-black-card/90 text-white hover:text-brand-red hover:bg-brand-black-soft border border-brand-black-muted shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-red/50 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Carousel Track & Cards */}
        <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
          {members.map((member, index) => {
            const { className, transform } = getCardStyle(index);
            const isCenter = index === currentIndex;

            return (
              <div
                key={member.id}
                onClick={() => !isCenter && setCurrentIndex(index)}
                style={{
                  transform,
                  transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
                className={`absolute w-44 sm:w-56 md:w-64 h-60 sm:h-72 md:h-84 rounded-2xl md:rounded-3xl overflow-hidden bg-brand-black-card border border-brand-black-muted/80 transform-gpu ${className}`}
              >
                <div className="relative w-full h-full group">
                  <img
                    src={member.image}
                    alt={member.name}
                    onError={(e) => {
                      // Fallback image if custom image isn't available
                      (e.target as HTMLImageElement).src = '/crew/behindTheCrib.jpeg';
                    }}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Mobile overlay name tag */}
                  <div className="absolute bottom-3 left-3 right-3 md:hidden pointer-events-none">
                    <p className="text-xs font-black text-white truncate drop-shadow-md">
                      {member.name}
                    </p>
                    <p className="text-[10px] font-bold text-brand-red truncate drop-shadow-md uppercase">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Navigation Arrow */}
        <button
          onClick={handleNext}
          aria-label="Next team member"
          className="absolute right-2 sm:right-4 md:right-8 z-40 p-2.5 sm:p-3 rounded-full bg-brand-black-card/90 text-white hover:text-brand-red hover:bg-brand-black-soft border border-brand-black-muted shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-red/50 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Member Info Section */}
      <div className="mt-4 text-center px-4 max-w-lg transition-all duration-500 min-h-[90px] flex flex-col items-center justify-center">
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {currentMember.name}
        </h3>

        <div className="flex items-center justify-center gap-3 my-1.5">
          <div className="w-8 sm:w-12 h-[1.5px] bg-brand-red/60" />
          <span className="text-xs sm:text-sm font-extrabold tracking-wider text-brand-red uppercase">
            {currentMember.role}
          </span>
          <div className="w-8 sm:w-12 h-[1.5px] bg-brand-red/60" />
        </div>

        {currentMember.bio && (
          <p className="text-xs text-brand-white/70 max-w-md italic mt-1 leading-relaxed">
            "{currentMember.bio}"
          </p>
        )}
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {members.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-red/50 ${isActive
                  ? 'w-7 h-2.5 bg-brand-red shadow-md shadow-brand-red/40'
                  : 'w-2.5 h-2.5 bg-brand-white/25 hover:bg-brand-white/50'
                }`}
            />
          );
        })}
      </div>
    </div>
  );
};

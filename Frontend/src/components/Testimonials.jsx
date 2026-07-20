import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonialsRow1 = [
  {
    id: "r1-1",
    name: "Amit Sharma",
    role: "Small Business Owner",
    text: "Cash Book has completely transformed how I manage my daily shop khata. It's intuitive, fast, and very reliable."
  },
  {
    id: "r1-2",
    name: "Priya Patel",
    role: "Freelance Designer",
    text: "Before this app, tracking my invoices and daily expenses was a nightmare. Now everything is just a click away, and I can generate PDF reports for my clients instantly. I couldn't be happier with the service, it really takes the headache out of accounting.",
    isLong: true
  },
  {
    id: "r1-3",
    name: "Rahul Singh",
    role: "Retail Shop",
    text: "Best ledger app in India. Very fast and secure. The cloud sync is seamless and I never worry about losing data."
  },
  {
    id: "r1-4",
    name: "Neha Gupta",
    role: "Event Manager",
    text: "I manage multiple budgets across different events simultaneously. Cash Book's interface lets me switch between them effortlessly. The transaction logging is super fast, which is exactly what I need when I'm on the go at a busy venue.",
    isLong: true
  },
  {
    id: "r1-5",
    name: "Vikram Reddy",
    role: "Restaurant Owner",
    text: "Tracks our daily cash flow perfectly. Great for restaurants and cafes to tally end of day sales."
  }
];

const testimonialsRow2 = [
  {
    id: "r2-1",
    name: "Suresh Kumar",
    role: "Wholesale Trader",
    text: "The team management feature is a lifesaver. I can assign roles to my staff and they can enter transactions directly from their phones. It syncs instantly to my dashboard so I always know our exact cash position at any time of day.",
    isLong: true
  },
  {
    id: "r2-2",
    name: "Anita Desai",
    role: "Homemaker",
    text: "Great for managing household monthly budgets. It keeps me on track with my grocery and utility limits."
  },
  {
    id: "r2-3",
    name: "Arjun Mehta",
    role: "Startup Founder",
    text: "We use the premium features for our startup. The automated categorizations and predictive forecasting are simply brilliant. It helps us stay lean and focused on growth without worrying if our runway calculations are off by a few margins.",
    isLong: true
  },
  {
    id: "r2-4",
    name: "Manoj Tiwari",
    role: "Freelancer",
    text: "Simple, ad-free, and does exactly what it says. The UI is clean and distraction-free."
  },
  {
    id: "r2-5",
    name: "Sneha Rao",
    role: "Boutique Owner",
    text: "I love the clean UI and the dark mode option! Makes reviewing sales at night very pleasant."
  }
];

const TestimonialCard = ({ data, expandedCard, setExpandedCard }) => {
  const isExpanded = expandedCard === data.id;

  return (
    <div className="w-[350px] md:w-[400px] flex-shrink-0 touch-pan-y group p-2">
      <div 
        className="bg-card border border-border p-6 rounded-2xl h-full flex flex-col relative overflow-hidden shadow-lg shadow-black/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:-translate-y-1 group-hover:border-primary/30"
      >
        <div className="absolute top-4 right-4 opacity-10">
          <Quote className="w-12 h-12 text-primary" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {data.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm">{data.name}</h4>
            <p className="text-xs text-muted-foreground mb-1">{data.role}</p>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <p className={`text-sm text-foreground/80 leading-relaxed ${!isExpanded && data.isLong ? 'line-clamp-3' : ''}`}>
            "{data.text}"
          </p>
        </div>

        {data.isLong && (
          <button
            onClick={() => setExpandedCard(isExpanded ? null : data.id)}
            className="mt-3 text-xs font-bold text-primary hover:text-primary/80 self-start transition-colors"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
    </div>
  );
};

export const Testimonials = () => {
  // We track which card is expanded in which row to pause the specific row.
  const [expandedCardRow1, setExpandedCardRow1] = useState(null);
  const [expandedCardRow2, setExpandedCardRow2] = useState(null);

  return (
    <section className="py-16 bg-background overflow-hidden relative">
      <style>
        {`
          @keyframes marquee-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 1rem)); }
          }
          @keyframes marquee-right {
            0% { transform: translateX(calc(-50% - 1rem)); }
            100% { transform: translateX(0); }
          }
          .animate-marquee-left {
            animation: marquee-left 45s linear infinite;
          }
          .animate-marquee-right {
            animation: marquee-right 45s linear infinite;
            will-change: transform;
          }
          .animate-marquee-left:hover,
          .animate-marquee-right:hover {
            animation-play-state: paused !important;
          }
          .marquee-paused {
            animation-play-state: paused !important;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Testimonials</h2>
        <h3 className="text-3xl md:text-3xl font-black text-foreground tracking-tight">
          What they say <span className="text-primary">about us</span>
        </h3>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Don't just take our word for it. Join thousands of users who have streamlined their finances with Cash Book.
        </p>
      </div>

      <div className="flex flex-col gap-6 relative w-full left-0">

        {/* Row 1: Right to Left */}
        <div className="w-full inline-flex flex-nowrap overflow-visible">
          <div className={`flex items-start gap-6 animate-marquee-left ${expandedCardRow1 ? 'marquee-paused' : ''}`} style={{ width: 'max-content' }}>
            {/* Original Array */}
            {testimonialsRow1.map((item, idx) => (
              <TestimonialCard
                key={`${item.id}-${idx}-1`}
                data={item}
                expandedCard={expandedCardRow1}
                setExpandedCard={setExpandedCardRow1}
              />
            ))}
            {/* Duplicated Array for infinite scroll */}
            {testimonialsRow1.map((item, idx) => (
              <TestimonialCard
                key={`${item.id}-${idx}-2`}
                data={item}
                expandedCard={expandedCardRow1}
                setExpandedCard={setExpandedCardRow1}
              />
            ))}
          </div>
        </div>

        {/* Row 2: Left to Right */}
        <div className="w-full inline-flex flex-nowrap overflow-visible">
          <div className={`flex items-start gap-6 animate-marquee-right ${expandedCardRow2 ? 'marquee-paused' : ''}`} style={{ width: 'max-content' }}>
            {/* Original Array */}
            {testimonialsRow2.map((item, idx) => (
              <TestimonialCard
                key={`${item.id}-${idx}-1`}
                data={item}
                expandedCard={expandedCardRow2}
                setExpandedCard={setExpandedCardRow2}
              />
            ))}
            {/* Duplicated Array for infinite scroll */}
            {testimonialsRow2.map((item, idx) => (
              <TestimonialCard
                key={`${item.id}-${idx}-2`}
                data={item}
                expandedCard={expandedCardRow2}
                setExpandedCard={setExpandedCardRow2}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Fade Overlays */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent z-10"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent z-10"></div>
    </section>
  );
};

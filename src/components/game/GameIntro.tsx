
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const GameIntro = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const storySlides = [
    {
      text: "Park Soonchul was a poor but honest man — a factory mechanic and part-time martial arts coach in the outskirts of Seoul. He lived a quiet life with his loving wife, barely surviving but full of pride in living clean.",
      image: "mechanic"
    },
    {
      text: "One day, burdened by an unexpected debt from a friend who betrayed him and ran, Soonchul's house was seized. They were forced to live on the streets.",
      image: "homeless"
    },
    {
      text: "Soon after, tragedy struck — his wife was murdered during a gang initiation by a thug whose boss ruled the local underworld. The justice system ignored him. The killer was never arrested.",
      image: "murder"
    },
    {
      text: "That night, his life ended — and his new one began.",
      image: "transformation"
    },
    {
      text: "Now homeless, haunted by voices of his wife and the killer's face, Soonchul chooses the path of revenge. He starts from the dirt — selling drugs, committing petty crimes.",
      image: "revenge"
    },
    {
      text: "But he's not alone. As he climbs the ladder, he gathers allies — other outcasts and misfits, each with a reason to burn the system.",
      image: "allies"
    },
    {
      text: "At first, he tells himself it's all for revenge. But as the blood spills and money flows, his purpose mutates. He's no longer chasing justice — he's building an empire.",
      image: "empire"
    },
    {
      text: "Cold. Strategic. Ruthless. They call him Pure Iron.",
      image: "pure_iron"
    }
  ];

  const handleNext = () => {
    if (currentSlide < storySlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/home');
    }
  };

  const handleSkip = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl bg-card border-border p-6 relative">
        <div className="h-48 bg-muted rounded-md mb-6 flex items-center justify-center">
          <div className="text-xl font-bold text-accent opacity-50">
            {storySlides[currentSlide].image}
          </div>
        </div>

        <p className="game-text mb-8">
          {storySlides[currentSlide].text}
        </p>

        <div className="flex justify-between items-center">
          <Button 
            variant="outline"
            onClick={handleSkip} 
            className="game-btn-secondary"
          >
            Skip Intro
          </Button>
          
          <Button 
            onClick={handleNext} 
            className="game-btn"
          >
            {currentSlide < storySlides.length - 1 ? "Continue" : "Begin Game"}
          </Button>
        </div>
        
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1 mt-4">
          {storySlides.map((_, index) => (
            <div 
              key={index} 
              className={`h-1 w-6 rounded-full ${index === currentSlide ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default GameIntro;

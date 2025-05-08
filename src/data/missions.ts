
export interface Mission {
  id: string;
  name: string;
  description: string;
  staminaCost: number;
  courageCost: number;
  durationMinutes: number;
  moneyReward: number;
  expReward: number;
  unlockLevel: number;
  riskLevel: number; // 1-5
  requiredMembers: number;
  story: string[];
  successRate: number; // 0-100
}

export const missions: Mission[] = [
  // Level 1 - Marijuana Dealing
  {
    id: 'deal_weed_alley',
    name: 'Sell Weed in Back Alley',
    description: 'Make your first criminal income selling marijuana in back alleys.',
    staminaCost: 5,
    courageCost: 0,
    durationMinutes: 10,
    moneyReward: 100,
    expReward: 5,
    unlockLevel: 1,
    riskLevel: 1,
    requiredMembers: 0,
    successRate: 90,
    story: [
      "The streets are quiet. You wait in the shadows, heart racing.",
      "A young man approaches. He looks nervous. First-time buyer.",
      "Money exchanges hands. A small bag of weed for cash. Quick, silent.",
      "It's dirty money. But it's money. You think of your wife, gone now. This is just survival."
    ]
  },
  {
    id: 'deal_weed_campus',
    name: 'Campus Distribution',
    description: 'Expand your operation to a nearby campus.',
    staminaCost: 8,
    courageCost: 2,
    durationMinutes: 20,
    moneyReward: 250,
    expReward: 10,
    unlockLevel: 1,
    riskLevel: 2,
    requiredMembers: 0,
    successRate: 85,
    story: [
      "Students loiter near the campus gates. Perfect targets - young, stressed, cash from parents.",
      "You approach casually. 'Stress relief?' you ask a boy with tired eyes.",
      "Security guard glances over. You pretend to check your phone.",
      "Five sales in thirty minutes. This is almost too easy."
    ]
  },
  {
    id: 'confront_killer',
    name: "Confront Wife's Killer",
    description: "Track down the gang member who murdered your wife.",
    staminaCost: 15,
    courageCost: 10,
    durationMinutes: 30,
    moneyReward: 0,
    expReward: 50,
    unlockLevel: 1,
    riskLevel: 4,
    requiredMembers: 0,
    successRate: 70,
    story: [
      "After weeks of asking questions, you find him in a rundown bar.",
      "He doesn't recognize you. Why would he? Just another faceless victim.",
      "You follow him outside. The knife feels cold in your hand.",
      "It's over quickly. His eyes show confusion, then nothing.",
      "'Soo-ah,' you whisper your wife's name. First blood of many."
    ]
  },
  
  // Level 2 - Shoplifting/Robbery
  {
    id: 'shoplift_electronics',
    name: 'Shoplift Electronics',
    description: 'Steal high-value electronics from a department store.',
    staminaCost: 10,
    courageCost: 5,
    durationMinutes: 15,
    moneyReward: 400,
    expReward: 15,
    unlockLevel: 2,
    riskLevel: 2,
    requiredMembers: 0,
    successRate: 80,
    story: [
      "The security tag removal tool feels foreign in your hands. A month ago, you were fixing machines.",
      "You slip the smartphone into your modified jacket. Then another.",
      "Security camera blind spots - you've mapped them all.",
      "Outside, you breathe again. So easy to cross lines when you have nothing left to lose."
    ]
  },
  {
    id: 'rob_convenience',
    name: 'Rob Convenience Store',
    description: 'Armed robbery of a late-night convenience store.',
    staminaCost: 15,
    courageCost: 15,
    durationMinutes: 5,
    moneyReward: 600,
    expReward: 25,
    unlockLevel: 2,
    riskLevel: 4,
    requiredMembers: 0,
    successRate: 75,
    story: [
      "Mask on. Gun out. Not loaded, but they don't know that.",
      "'MONEY! NOW!' Your voice sounds strange to your own ears.",
      "The clerk's hands shake. He has a family too, probably.",
      "You grab the cash and run. This isn't you. But then, who are you now?"
    ]
  }
];

// More missions would continue for higher levels...

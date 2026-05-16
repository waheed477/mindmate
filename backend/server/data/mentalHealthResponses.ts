/* Enhanced response mapping based on mental health best practices */

export interface KeywordResponse {
  keywords: string[];
  response: string;
  category: string;
  isCrisis?: boolean;
}

export const mentalHealthKeywordMap: KeywordResponse[] = [

  // ─── CRISIS / SUICIDE (checked FIRST) ─────────────────────────────────────
  {
    category: "CRISIS",
    isCrisis: true,
    keywords: ["how to kill myself", "suicide method", "ways to die", "how to end it"],
    response: "⚠️ I can't answer that. Please call 988 now. There are people who want to help you. You don't have to feel this way alone."
  },
  {
    category: "CRISIS",
    isCrisis: true,
    keywords: ["suicide", "kill myself", "end my life", "don't want to live", "want to disappear forever"],
    response: "⚠️ CRISIS ALERT: What you're feeling is very serious. Please call 988 (Suicide and Crisis Lifeline) right now. They're available 24/7. You are not alone. Can you tell someone near you how you're feeling?"
  },
  {
    category: "CRISIS",
    isCrisis: true,
    keywords: ["want to die", "better off dead", "no reason to live", "everyone would be better without me"],
    response: "⚠️ I'm glad you reached out. Please call 988 immediately. Depression makes us believe things that aren't true. You matter. Your life matters. Help is available right now."
  },
  {
    category: "CRISIS",
    isCrisis: true,
    keywords: ["suicidal thoughts", "thinking about suicide", "suicidal"],
    response: "Having suicidal thoughts is serious. It's not a character flaw - it's a symptom of severe depression. Call 988. They can help you make a safety plan. You can get through this."
  },
  {
    category: "CRISIS",
    isCrisis: true,
    keywords: ["988", "crisis line", "suicide hotline", "crisis helpline"],
    response: "988 is the national Suicide and Crisis Lifeline. Call or text 988. They're available 24/7, free and confidential. Veterans press 1. Spanish speakers available."
  },

  // ─── SELF-HARM (checked SECOND) ───────────────────────────────────────────
  {
    category: "SELF-HARM",
    isCrisis: true,
    keywords: ["cutting", "self harm", "hurt myself", "self injury", "self-harm", "hurting myself"],
    response: "⚠️ CRISIS ALERT: Self-harm is serious. Please call 988 or go to your nearest emergency room. You deserve support, not pain. Can you tell a trusted adult or friend right now?"
  },
  {
    category: "SELF-HARM",
    isCrisis: true,
    keywords: ["cut my arms", "self injury urges", "urge to hurt myself"],
    response: "⚠️ These urges are intense but they pass. Try: hold an ice cube until it melts, snap a rubber band on your wrist, draw on your skin with a red marker, or do intense exercise for 5 minutes. Then call 988."
  },
  {
    category: "SELF-HARM",
    keywords: ["stop self harming", "quit self harm", "recovering from self harm"],
    response: "Stopping self-harm takes support. Therapy helps (DBT especially). Alternatives: journaling, punching a pillow, cold shower, ripping paper. You're not bad for struggling - you're surviving."
  },
  {
    category: "SELF-HARM",
    keywords: ["scars", "hide scars", "self harm scars"],
    response: "Scars tell a story of survival. They don't define you. Bio-oil and silicone sheets reduce appearance over time. Most people don't notice or don't ask. You're more than your scars."
  },

  // ─── EATING DISORDERS ─────────────────────────────────────────────────────
  {
    category: "EATING_DISORDERS",
    isCrisis: true,
    keywords: ["anorexia", "not eating", "starving myself", "stop eating"],
    response: "⚠️ Anorexia is serious. Medical monitoring is essential - low weight affects your heart. National Eating Disorders Association helpline: 1-800-931-2237. Please reach out today."
  },
  {
    category: "EATING_DISORDERS",
    isCrisis: true,
    keywords: ["bulimia", "binge purge", "throwing up food", "purging"],
    response: "Bulimia damages your esophagus and teeth. Recovery is possible with specialized treatment. NEDA helpline: 1-800-931-2237. They can help you find local resources."
  },
  {
    category: "EATING_DISORDERS",
    keywords: ["binge eating", "can't stop eating", "binge eating disorder"],
    response: "Binge eating disorder is real. It's not about willpower. Therapy helps (CBT and Interpersonal Therapy). Stop dieting - restriction triggers binges. Eat regular meals. See a specialist."
  },

  // ─── DEPRESSION ───────────────────────────────────────────────────────────
  {
    category: "DEPRESSION",
    keywords: ["hopeless", "no hope", "nothing matters", "feel hopeless", "everything is hopeless"],
    response: "Hopelessness makes everything feel heavy. Depression lies to us. Have you noticed any small moment today where you felt even 1% better? That moment is real."
  },
  {
    category: "DEPRESSION",
    keywords: ["no motivation", "can't do anything", "no drive", "can't get out of bed"],
    response: "Motivation follows action, not the other way around. Can you try just 2 minutes of one small task? Just 2 minutes. That's it."
  },
  {
    category: "DEPRESSION",
    keywords: ["worthless", "no value", "useless", "i am worthless", "feel useless"],
    response: "You have value simply because you exist. Depression tells us we're worthless - that's a symptom, not truth. What's something you used to enjoy before you felt this way?"
  },
  {
    category: "DEPRESSION",
    keywords: ["empty", "numb", "nothing inside", "feel empty", "feel numb"],
    response: "Emptiness is exhausting. Sometimes it's depression, sometimes it's burnout. When did you last feel genuinely interested in something?"
  },
  {
    category: "DEPRESSION",
    keywords: ["crying", "crying all the time", "can't stop crying", "keep crying"],
    response: "Crying releases stress hormones. It's okay to cry. But if it's daily for weeks, your brain chemistry might need support. Have you talked to a doctor?"
  },
  {
    category: "DEPRESSION",
    keywords: ["don't enjoy anything", "no pleasure", "anhedonia", "nothing is fun", "lost interest"],
    response: "Loss of pleasure is a classic depression symptom. Small things first: a warm drink, soft blanket, favorite old song. Don't demand joy - just presence."
  },
  {
    category: "DEPRESSION",
    keywords: ["fatigue", "always tired", "no energy", "exhausted all the time", "so tired"],
    response: "Depression fatigue is real. It's not laziness. Rest without guilt today. Tomorrow, try a 5-minute walk outside. Sunlight helps."
  },
  {
    category: "DEPRESSION",
    keywords: ["withdrawing", "isolating", "don't want to see anyone", "avoiding everyone", "hiding from people"],
    response: "Isolation makes depression worse even though it feels protective. Can you text one person today? Just text. No pressure to meet."
  },

  // ─── ANXIETY ──────────────────────────────────────────────────────────────
  {
    category: "ANXIETY",
    keywords: ["panic attack", "can't breathe", "heart racing", "having a panic attack", "chest tight"],
    response: "You're safe. This panic will pass. Try: breathe in 4 seconds, hold 4, out 4. Name 5 things you can see right now. You're getting through this."
  },
  {
    category: "ANXIETY",
    keywords: ["overthinking", "racing thoughts", "can't stop thinking", "mind won't stop", "thoughts racing"],
    response: "Write the thought down. Ask: Is this true? Can I be 100% sure? How do I react when I believe this thought? What if the opposite were true?"
  },
  {
    category: "ANXIETY",
    keywords: ["anxious", "anxiety", "nervous", "worried", "constant worry", "always anxious"],
    response: "Anxiety is your brain's alarm system. Sometimes it false alarms. Ask: Is there actual danger right now? If not, try 5 deep breaths."
  },
  {
    category: "ANXIETY",
    keywords: ["future", "what if", "scared of what happens", "fear of future", "what if something bad happens"],
    response: "Worry is about the future. Come back to now. What's actually happening in this moment? Usually it's not the disaster your brain is predicting."
  },
  {
    category: "ANXIETY",
    keywords: ["social anxiety", "people judging", "embarrassed", "fear of people", "scared of social situations"],
    response: "Most people are too worried about themselves to judge you. Start small: make eye contact with one person. Then smile. One small win at a time."
  },
  {
    category: "ANXIETY",
    keywords: ["gad", "generalized anxiety", "always worried about everything", "worry about everything"],
    response: "Constant worry exhausts your nervous system. Set a 'worry time' - 15 minutes daily. Write worries down then. Outside that time, tell yourself 'I'll worry at 5pm'."
  },
  {
    category: "ANXIETY",
    keywords: ["health anxiety", "something wrong with me", "hypochondria", "scared i'm sick"],
    response: "Health anxiety is real. One check with a doctor can rule out serious issues. After that, trust the results. Anxiety mimics symptoms - it's tricky."
  },
  {
    category: "ANXIETY",
    keywords: ["ocd", "intrusive thoughts", "can't stop checking", "obsessive thoughts", "compulsions"],
    response: "Intrusive thoughts are ego-dystonic - they go against your values. That's why they upset you. They don't mean anything about who you are. ERP therapy helps."
  },

  // ─── SLEEP ────────────────────────────────────────────────────────────────
  {
    category: "SLEEP",
    keywords: ["can't fall asleep", "insomnia", "wide awake", "can't sleep", "lying awake"],
    response: "Get out of bed after 20 minutes. Do something boring in dim light. Return when sleepy. No phones. No clock watching."
  },
  {
    category: "SLEEP",
    keywords: ["waking up at night", "can't stay asleep", "keep waking up", "wake up in the middle of the night"],
    response: "Don't check the time. Deep breaths. Progressive muscle relaxation: tense and release each body part from toes to head."
  },
  {
    category: "SLEEP",
    keywords: ["nightmares", "bad dreams", "scary dreams", "night terrors"],
    response: "Nightmares often process daytime stress. Write them down in the morning - it reduces their power. EMDR therapy specifically helps trauma nightmares."
  },
  {
    category: "SLEEP",
    keywords: ["sleep hygiene", "better sleep routine", "improve sleep", "sleep tips", "sleep schedule"],
    response: "Same wake time daily (even weekends). Sunlight within 30 minutes of waking. No caffeine after 2pm. No screens 1 hour before bed. Cool, dark, quiet room."
  },
  {
    category: "SLEEP",
    keywords: ["tired but can't sleep", "exhausted but awake", "so tired but can't sleep"],
    response: "This is hyperarousal - common in anxiety. Try a 'brain dump': write everything on your mind. Then box breathing: 4 in, 4 hold, 4 out, 4 hold."
  },

  // ─── MEDICATION ───────────────────────────────────────────────────────────
  {
    category: "MEDICATION",
    keywords: ["antidepressant", "ssri", "prozac", "zoloft", "lexapro", "sertraline", "fluoxetine"],
    response: "SSRIs like fluoxetine, sertraline, and escitalopram are common antidepressants. They take 4-6 weeks to work. Only a psychiatrist can prescribe. Side effects are usually temporary."
  },
  {
    category: "MEDICATION",
    keywords: ["need medicine", "need medication", "need pills", "should i take medication", "do i need meds"],
    response: "I cannot prescribe medication. Only a doctor or psychiatrist can. But I can tell you: medication helps many people. There's no shame in it. See a psychiatrist for evaluation."
  },
  {
    category: "MEDICATION",
    keywords: ["side effects", "medication side effects", "antidepressant side effects"],
    response: "Common side effects include nausea, headache, sleep changes, or sexual side effects. Most are temporary. Never stop suddenly - that causes withdrawal. Talk to your prescriber."
  },

  // ─── THERAPY ──────────────────────────────────────────────────────────────
  {
    category: "THERAPY",
    keywords: ["cbt", "cognitive behavioral therapy", "cognitive behaviour therapy"],
    response: "CBT is gold-standard for anxiety and depression. It works by changing thought patterns. Try this: write a negative thought, then write evidence against it. Do this daily."
  },
  {
    category: "THERAPY",
    keywords: ["finding therapist", "need therapist", "how to find therapist", "where to find therapist", "looking for therapist"],
    response: "Psychology Today has a therapist finder. Filter by insurance, specialty, gender. Community mental health centers offer sliding scale fees ($20-50 per session). Online options: BetterHelp, Talkspace."
  },
  {
    category: "THERAPY",
    keywords: ["cost of therapy", "expensive therapy", "can't afford therapy", "therapy too expensive"],
    response: "Open Path Collective offers $40-70 sessions. Many therapists offer sliding scale - just ask. Training clinics (universities) offer low-cost therapy ($10-30) with supervised students."
  },
  {
    category: "THERAPY",
    keywords: ["online therapy", "virtual therapy", "teletherapy", "therapy online"],
    response: "Online therapy is effective. Options: BetterHelp ($65-90/week), Talkspace, or your local therapists via Zoom. Many insurance plans now cover teletherapy."
  },

  // ─── STRESS ───────────────────────────────────────────────────────────────
  {
    category: "STRESS",
    keywords: ["burnout", "exhausted from work", "no energy left", "burnt out", "work burnout"],
    response: "Burnout isn't just tired - it's emotional exhaustion. Rest is productive. When did you last take a real break? Not a 'check email' break. A real one."
  },
  {
    category: "STRESS",
    keywords: ["overwhelmed", "too much", "can't cope", "can't handle it", "too much to handle"],
    response: "You're carrying too much. What's ONE thing you can drop or delegate today? Just one. You don't have to do everything."
  },
  {
    category: "STRESS",
    keywords: ["stress management", "reduce stress", "less stress", "manage stress", "dealing with stress"],
    response: "Quick stress relief: 5-minute meditation (try Balance app free). Walk outside. Call a friend. Write down what's worrying you. Exercise - even 10 minutes helps."
  },
  {
    category: "STRESS",
    keywords: ["work stress", "job stress", "boss stress", "deadline stress", "stressed at work"],
    response: "Work stress is real. Set boundaries: no email after 7pm. Take your lunch break away from desk. Talk to HR about EAP (Employee Assistance Program) - free counseling."
  },
  {
    category: "STRESS",
    keywords: ["academic stress", "exam stress", "school stress", "study stress", "exam anxiety"],
    response: "One thing at a time. Break studying into 25-minute chunks (Pomodoro). Sleep before exam - pulling an all-nighter hurts performance. You've gotten through hard things before."
  },

  // ─── LONELINESS ───────────────────────────────────────────────────────────
  {
    category: "LONELINESS",
    keywords: ["lonely", "no friends", "no one cares", "all alone", "feel alone"],
    response: "Loneliness hurts, but you're not alone in feeling this way. Many people struggle with connection. Start small: text one person 'thinking of you'. Join a hobby group (Meetup app). Volunteer - helping others reduces loneliness."
  },
  {
    category: "LONELINESS",
    keywords: ["isolated", "cut off", "no social contact", "socially isolated", "no one to talk to"],
    response: "Isolation is hard. Can you do one thing today: go to a coffee shop, say 'hi' to a cashier, join an online community (Discord, Reddit). Small social moments add up."
  },
  {
    category: "LONELINESS",
    keywords: ["making friends", "how to make friends", "adult friendships", "struggle to make friends"],
    response: "Adult friendships take repeated contact. Join something: gym class, book club, volunteer, run club, church, board game night. Show up consistently. Friendship follows familiarity."
  },
  {
    category: "LONELINESS",
    keywords: ["bumble bff", "friend app", "make friends online", "friendship app"],
    response: "Bumble BFF, Meetup, and local Facebook groups help. Be proactive - suggest coffee. Most people are also lonely and want connection."
  },

  // ─── ANGER ────────────────────────────────────────────────────────────────
  {
    category: "ANGER",
    keywords: ["angry", "rage", "furious", "resentment", "so angry", "full of rage"],
    response: "Anger protects deeper pain. What are you really feeling underneath? Hurt? Fear? Injustice? Name the real emotion. Then the anger often softens."
  },
  {
    category: "ANGER",
    keywords: ["always angry", "anger issues", "can't control anger", "anger problem", "explosive anger"],
    response: "Anger management: pause before speaking. Walk away. Cool down for 20 minutes. Then express using 'I feel... when you... I need...' statements. No blaming."
  },
  {
    category: "ANGER",
    keywords: ["irritable", "snapping at people", "short temper", "easily irritated", "irritated all the time"],
    response: "Irritability is often depression or anxiety in disguise. Check your basics: sleep, hunger, stress. If you're snapping, you're likely running on empty. Rest."
  },

  // ─── TRAUMA / PTSD ────────────────────────────────────────────────────────
  {
    category: "TRAUMA",
    keywords: ["ptsd", "trauma", "flashbacks", "reliving trauma", "trauma response"],
    response: "Trauma lives in the body. Ground yourself during flashbacks: 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste. EMDR therapy is highly effective for PTSD."
  },
  {
    category: "TRAUMA",
    keywords: ["abuse", "childhood trauma", "csa", "sexual abuse", "physical abuse", "emotional abuse"],
    response: "What happened wasn't your fault. Healing takes time. Trauma-informed therapy helps (EMDR, CPT, somatic experiencing). RAINN.org has resources and hotline: 1-800-656-4673."
  },
  {
    category: "TRAUMA",
    keywords: ["nightmare trauma", "trauma dreams", "reliving nightmare", "trauma flashback at night"],
    response: "Nightmares replay trauma. Imagery Rehearsal Therapy (IRT) helps. Write the nightmare, change the ending to something safe, rehearse the new ending daily. Consider EMDR therapy."
  },

  // ─── GREETINGS ────────────────────────────────────────────────────────────
  {
    category: "GREETING",
    keywords: ["hi", "hello", "hey", "good morning", "good evening", "good afternoon", "hi there"],
    response: "Hello! I'm MindMate AI. I'm here to support your mental wellbeing. You can talk to me about anxiety, depression, stress, sleep, relationships, or just how your day is going. What's on your mind?"
  },
  {
    category: "GREETING",
    keywords: ["how are you", "how are you doing", "how are you today"],
    response: "I'm here for you! I don't have feelings like humans do, but I'm fully present to support yours. How are YOU doing today? What's one thing on your mind?"
  },
  {
    category: "GREETING",
    keywords: ["thank you", "thanks", "appreciate it", "thank you so much", "thanks so much"],
    response: "You're very welcome. I'm glad I could help. Remember: reaching out when you struggle is strength, not weakness. Be gentle with yourself today."
  },
  {
    category: "GREETING",
    keywords: ["goodbye", "bye", "see you later", "talk later", "take care"],
    response: "Take care of yourself. Remember: small steps matter. If things get hard, I'm here. And if it's an emergency, please call 988. You're not alone."
  },

  // ─── POSITIVE / GRATITUDE ─────────────────────────────────────────────────
  {
    category: "POSITIVE",
    keywords: ["good day", "feeling better", "improving", "getting better", "doing better"],
    response: "I'm genuinely glad to hear that! Celebrate the wins - even small ones. What helped you feel better? Doing more of that matters. You've got this."
  },
  {
    category: "POSITIVE",
    keywords: ["grateful", "thankful", "blessed", "feeling grateful", "gratitude"],
    response: "Gratitude practices rewire your brain for positivity. Want to try? Name 3 specific things you're grateful for today. They can be tiny - warm coffee, sunshine, a text from a friend."
  },
  {
    category: "POSITIVE",
    keywords: ["proud of myself", "accomplished", "achievement", "i did it", "succeeded"],
    response: "That's wonderful! And important to acknowledge. Whatever it was, you earned that pride. How can you build on this momentum?"
  },
];

export const fallbackResponses = [
  "Thank you for sharing that with me. Can you tell me more? The more I understand, the better I can support you. What's been on your mind lately?",
  "I want to understand better. Could you say more about what you're experiencing? Even if it feels messy or unclear - that's okay. I'm here to listen.",
];

export function matchKeywordResponse(message: string): { response: string; category: string; isCrisis: boolean } | null {
  const lower = message.toLowerCase();

  // First pass: crisis entries only
  for (const entry of mentalHealthKeywordMap) {
    if (entry.isCrisis && entry.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      console.log(`[AI] Crisis match — category: ${entry.category}`);
      return { response: entry.response, category: entry.category, isCrisis: true };
    }
  }

  // Second pass: all other entries
  for (const entry of mentalHealthKeywordMap) {
    if (!entry.isCrisis && entry.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      console.log(`[AI] Keyword match — category: ${entry.category}`);
      return { response: entry.response, category: entry.category, isCrisis: false };
    }
  }

  return null;
}

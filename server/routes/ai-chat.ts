import express from "express";
import { authenticate } from "../auth.js";

const router = express.Router();

const mentalHealthResponses: Array<{ keywords: string[]; responses: string[] }> = [
  {
    keywords: ["anxious", "anxiety", "anxiety all week", "anxious all week", "worried", "worry", "panic", "nervous"],
    responses: [
      "I hear you — feeling anxious for an extended period is really exhausting. Anxiety often builds up when our nervous system stays in a heightened state. A few things that can help right now:\n\n• **Box breathing**: Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4–5 times.\n• **Grounding (5-4-3-2-1)**: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.\n• **Limit caffeine** — it amplifies anxiety significantly.\n\nIf this has persisted for more than two weeks, speaking with a mental health professional can make a big difference. Would you like to share what's been triggering your anxiety?",
      "Persistent anxiety is your mind's way of signaling that something needs attention. That's valid — but it doesn't have to stay this intense.\n\nSome practical steps:\n• Try a **body scan** — lie down, close your eyes, and slowly release tension from your toes to your head.\n• **Journaling** for 10 minutes before bed can offload racing thoughts.\n• Physical movement, even a 20-minute walk, releases tension stored in the body.\n\nYou don't have to manage this alone. A therapist or psychiatrist can offer personalized tools. Is there a specific situation driving this anxiety?"
    ]
  },
  {
    keywords: ["negative thoughts", "cant stop", "can't stop", "overthinking", "ruminating", "intrusive", "dark thoughts"],
    responses: [
      "Negative thought loops are incredibly draining — your mind keeps revisiting the same painful paths. This is very common, and there are techniques that genuinely help.\n\n**Cognitive defusion** (from ACT therapy): Instead of 'I am worthless,' try saying 'I notice I'm having the thought that I'm worthless.' This creates distance between you and the thought.\n\n**The 'Thank you, mind' technique**: When a negative thought arrives, say mentally: 'Thank you, mind, for trying to protect me.' Acknowledge it, then redirect.\n\n**Schedule 'worry time'**: Pick 15 minutes a day for worrying. When negative thoughts appear outside that window, remind yourself you'll address them later.\n\nIs there a specific theme your thoughts keep returning to? I'm here to listen.",
      "I understand — it feels like your own mind is working against you. Negative thoughts often intensify when we try to suppress them (the 'don't think of a pink elephant' effect).\n\nA more effective approach is **acknowledgment without judgment**:\n1. Notice the thought: 'There it is again.'\n2. Label it: 'This is an anxious thought / self-critical thought.'\n3. Let it pass without engaging.\n\nAlso, check your basics — sleep deprivation and low blood sugar dramatically worsen negative thinking. How have you been sleeping and eating lately?"
    ]
  },
  {
    keywords: ["stress", "cope with stress", "overwhelmed", "burnout", "too much", "overloaded"],
    responses: [
      "Stress is a signal — your mind and body are telling you the load is too heavy right now. The good news is there are proven ways to reduce it.\n\n**Immediate relief:**\n• The **physiological sigh** (double inhale through the nose, long exhale through the mouth) activates your parasympathetic system within seconds.\n• Step outside for even 5 minutes — natural light and fresh air reset your cortisol levels.\n\n**Longer-term:**\n• Identify your top 3 stressors and write them down — externalizing them makes them feel more manageable.\n• Practice saying no to non-essential commitments.\n• Build one small restorative activity into each day (music, reading, a walk).\n\nWhat area of your life is feeling most overwhelming right now?",
      "Stress management is a skill — and like any skill, it gets easier with practice. Here's a framework that works:\n\n**Sort → Simplify → Soothe**\n• **Sort**: List everything stressing you. Separate what's in your control from what isn't.\n• **Simplify**: Focus only on the top 1–2 controllable items today.\n• **Soothe**: Build in at least one recovery activity daily.\n\nMindfulness and progressive muscle relaxation have strong research support for stress reduction. Even 5–10 minutes a day creates measurable changes over 2–4 weeks.\n\nWould you like guidance on a specific type of stress — work, relationships, health?"
    ]
  },
  {
    keywords: ["sleep", "cant sleep", "can't sleep", "insomnia", "struggling with sleep", "trouble sleeping", "nightmares", "wake up"],
    responses: [
      "Sleep struggles are deeply frustrating — and poor sleep makes everything else harder to cope with. Here's what the research shows actually works:\n\n**Sleep hygiene essentials:**\n• Keep a consistent wake time (even weekends) — this is the single most impactful change.\n• No screens 30–60 minutes before bed (blue light suppresses melatonin).\n• Keep your bedroom cool (65–68°F / 18–20°C) and dark.\n\n**Winding down:**\n• Try the **military sleep method**: relax your face, drop your shoulders, exhale and relax your chest, then legs. Visualize a calm scene.\n• **4-7-8 breathing**: inhale 4 counts, hold 7, exhale 8.\n\nIf insomnia has persisted for weeks, Cognitive Behavioral Therapy for Insomnia (CBT-I) is the gold-standard treatment — more effective than sleep medication long-term. How long has this been going on?",
      "Sleep is foundational to mental health — everything feels harder when we're running on empty. A few things to try:\n\n**Before bed routine (60 min before sleep):**\n1. Dim the lights in your home\n2. Write down tomorrow's tasks — this clears your mind\n3. Take a warm shower (the drop in body temperature afterward signals sleep)\n4. Practice a short relaxation exercise\n\n**If you wake up at night**: Avoid checking the clock — it increases anxiety. Instead, focus on slow breathing and body relaxation without pressure to fall asleep immediately.\n\nAre you having trouble falling asleep, staying asleep, or both?"
    ]
  },
  {
    keywords: ["lonely", "alone", "isolated", "loneliness", "no one", "no friends", "disconnected"],
    responses: [
      "Feeling lonely is one of the most painful human experiences — and it's more common than most people realize, especially in today's world. You're not alone in feeling alone.\n\n**Some thoughts that may help:**\n• Loneliness is often about the **quality** of connection, not just quantity. Even one meaningful relationship makes a significant difference.\n• **Small interactions matter**: A brief genuine conversation with a neighbor, barista, or coworker activates the same brain pathways as close friendships.\n• Consider joining a group centered around something you care about — a hobby, cause, or activity. Shared purpose is a powerful social connector.\n\nSometimes loneliness is also a signal to reconnect with yourself — through journaling, creative expression, or exploring what you truly value.\n\nWhat does connection look like for you — what kind of relationships are you hoping for?",
      "I'm glad you shared that — loneliness takes real courage to admit. It doesn't reflect your worth; it reflects a gap between the connection you need and what's currently available.\n\n**Research-backed steps:**\n• Reach out to one person from your past — a simple 'Hey, I was thinking of you' message has a surprisingly high response rate.\n• Volunteer for a cause you care about — helping others is one of the fastest antidotes to loneliness.\n• Explore online communities around your interests — these can be genuine connections.\n\nTherapy can also help address any social anxiety or past experiences that might be making connection feel harder. Would you like to talk about what's been getting in the way of connecting with others?"
    ]
  },
  {
    keywords: ["confidence", "self-confidence", "self-esteem", "self worth", "believe in myself", "insecure", "self-doubt"],
    responses: [
      "Building self-confidence is a process — it doesn't come from a burst of motivation but from **consistent small actions** that prove to yourself that you're capable.\n\n**Practical strategies:**\n• **Evidence log**: Each day, write down 1–2 things you did well. Over time, this rewires your self-perception.\n• **Act 'as if'**: Confidence follows action, not the other way around. Do the thing slightly before you feel ready.\n• **Limit social comparison** — especially on social media, which shows highlight reels, not real life.\n• **Body language first**: Research by Amy Cuddy shows that upright posture and open body language genuinely change how you feel within minutes.\n\n**Long-term**: Self-confidence grows when you repeatedly step slightly outside your comfort zone and survive. Each small success builds the foundation.\n\nIs there a specific area where you'd most like to feel more confident?",
      "Low self-confidence often has roots in past experiences, critical voices we've internalized, or negative comparison. Understanding where it comes from helps.\n\n**A reframing exercise:**\nImagine your best friend came to you with the same self-doubts. What would you tell them? Now — can you offer yourself that same compassion?\n\n**Daily practices that work:**\n• Set one small, achievable goal each day and complete it. Momentum builds confidence.\n• Speak to yourself as you'd speak to someone you love.\n• Acknowledge strengths you take for granted — reliability, creativity, kindness count just as much as traditional achievements.\n\nTherapy (especially CBT or ACT) is highly effective for building lasting self-esteem. What area of your life feels most affected by self-doubt?"
    ]
  },
  {
    keywords: ["depression", "depressed", "sad", "hopeless", "no motivation", "empty", "numb", "worthless"],
    responses: [
      "Thank you for trusting me with this. What you're describing sounds really heavy, and I want you to know it's okay to not be okay.\n\nDepression has a way of making everything feel flat, hopeless, and like it's always been this way — but that's the depression talking, not the truth.\n\n**Some gentle steps:**\n• **Behavioral activation**: Depression reduces activity, which deepens depression. Even small activities (a short walk, making tea, calling someone) can help break the cycle.\n• **Routine**: Predictable structure helps stabilize mood — consistent sleep, meals, and movement.\n• **Social connection**: Depression tells us to isolate. Try to have one interaction with another person today, even brief.\n\nPlease know that depression is treatable — most people see significant improvement with therapy, medication, or both. Have you spoken with a doctor or therapist about how you're feeling?\n\n⚠️ If you're having thoughts of harming yourself, please reach out to a crisis line: **988 (US)** or text HOME to 741741.",
      "I hear you, and I'm glad you're reaching out. Depression can make it hard to see a way forward — but you're here, and that matters.\n\nA few important things to know:\n• Depression is a medical condition, not a character flaw or weakness.\n• It's highly treatable — therapy (especially CBT) and medication each have strong evidence.\n• Recovery is possible, even when it doesn't feel like it.\n\nFor right now: try to be gentle with yourself. Depression asks a lot of your brain and body. Small acts of self-care — drinking water, getting some light, resting — matter even when they feel meaningless.\n\nIs there someone in your life you feel safe talking to about this? And if not, a therapist can be that person."
    ]
  },
  {
    keywords: ["grief", "loss", "lost someone", "death", "mourning", "bereavement", "miss"],
    responses: [
      "Grief is love with nowhere to go. What you're feeling is a testament to how much you cared — and there's no right way to grieve, and no timeline you need to follow.\n\nGrief doesn't move in neat stages. It comes in waves — sometimes you'll feel okay, then it crashes over you again. That's completely normal.\n\n**What tends to help:**\n• Allow yourself to feel it — suppressing grief prolongs it.\n• Talk about the person you've lost. Keeping their memory alive is healthy.\n• Be patient with yourself around 'triggers' — dates, places, songs.\n• Accept that grief and joy can coexist.\n\nIf grief is significantly interfering with daily functioning after several months, grief counseling can provide real support. Would you like to share about who or what you've lost?"
    ]
  },
  {
    keywords: ["trauma", "ptsd", "flashback", "abuse", "past", "childhood", "assault"],
    responses: [
      "Thank you for bringing this up — it takes real courage. Trauma stays in the body and mind long after the event, and your reactions make complete sense given what you've experienced.\n\n**Important to know:**\n• Trauma responses (flashbacks, hypervigilance, avoidance) are your nervous system trying to protect you — not signs of weakness.\n• Healing from trauma is absolutely possible with the right support.\n\n**Evidence-based treatments that work:**\n• EMDR (Eye Movement Desensitization and Reprocessing)\n• Trauma-focused CBT\n• Somatic therapies\n\nIn the moment, grounding techniques help: name 5 things you can see right now, feel your feet on the floor, hold something with a strong texture.\n\nI'd strongly encourage working with a trauma-informed therapist. You deserve support from someone trained in this. Are you currently working with anyone?"
    ]
  },
  {
    keywords: ["relationship", "breakup", "divorce", "partner", "toxic", "conflict", "argument"],
    responses: [
      "Relationship pain — whether from a breakup, ongoing conflict, or a toxic dynamic — can be some of the most emotionally intense pain there is.\n\n**After a breakup or loss:**\n• Allow yourself to grieve — this is a real loss.\n• Limit contact if it helps you heal (checking their social media typically prolongs pain).\n• Rediscover who you are outside of that relationship.\n\n**Ongoing relationship conflict:**\n• Use 'I feel' language rather than 'you always/never' to reduce defensiveness.\n• Pick the right time to talk — not when either person is tired, hungry, or already escalated.\n• Couples therapy is highly effective and doesn't mean a relationship is ending — it means you're investing in it.\n\nWhat aspect of the relationship is weighing on you most?"
    ]
  },
  {
    keywords: ["work", "job", "career", "boss", "coworker", "fired", "unemployed", "pressure at work"],
    responses: [
      "Work-related stress can be all-consuming, especially when it feels like your livelihood or identity is wrapped up in it.\n\n**For immediate overwhelm:**\n• Create a 'minimum viable day' — identify the 1–3 things that truly must get done, and let the rest go temporarily.\n• Take micro-breaks every 90 minutes — even 5 minutes of walking or stretching significantly improves focus and mood.\n\n**For longer-term work stress:**\n• Clarify what's in your control vs. not — focus energy only on the former.\n• Set clear boundaries around work hours — protecting non-work time is essential for recovery.\n• If your workplace is genuinely toxic, document issues and consider your options — your mental health is more valuable than any job.\n\nIs the stress coming from workload, relationships at work, or uncertainty about your career?"
    ]
  }
];

const generalResponses = [
  "Thank you for sharing that with me. Mental health is deeply personal, and I want to make sure I understand what you're going through.\n\nCould you tell me a bit more? For example:\n• How long have you been feeling this way?\n• Is this something that came on suddenly or has it been building?\n• Are there specific situations that make it better or worse?\n\nI'm here to listen and offer support based on what you share.",
  "I appreciate you opening up. Whatever you're going through, you don't have to navigate it alone.\n\nSome general principles that support mental wellbeing:\n• **Sleep**: 7–9 hours is foundational — almost every mental health challenge worsens with poor sleep.\n• **Movement**: Even 20–30 minutes of walking daily has measurable effects on mood.\n• **Connection**: One meaningful conversation with someone you trust per day.\n• **Meaning**: Small acts that align with your values, even when motivation is low.\n\nIs there something specific on your mind you'd like to explore further?",
  "I'm here for you. What you're feeling is valid, and reaching out is an important step.\n\nMental health exists on a spectrum, and everyone struggles at different points. The fact that you're seeking support shows real self-awareness and strength.\n\nFeel free to share more about what's going on — whether it's a specific emotion, situation, or just a general sense that something is off. I'll do my best to offer thoughtful support.\n\nAnd remember: while I can offer general guidance and a compassionate ear, a licensed therapist or counselor can provide personalized, ongoing support tailored specifically to you."
];

function getAIResponse(message: string): string {
  const lowerMsg = message.toLowerCase();

  for (const category of mentalHealthResponses) {
    if (category.keywords.some((kw) => lowerMsg.includes(kw))) {
      const responses = category.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

router.post("/chat", authenticate, async (req: any, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    const response = getAIResponse(message.trim());

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("AI chat error:", error);
    res.status(500).json({ success: false, message: "Failed to process your message" });
  }
});

export default router;

import express from "express";
import { authenticate } from "../auth.js";
import { matchKeywordResponse, fallbackResponses } from "../data/mentalHealthResponses.js";

const router = express.Router();

// ─── Layer 2: Rich multi-response categories ──────────────────────────────────
// These add variety with 2+ responses per theme, chosen randomly.

const detailedResponses: Array<{ keywords: string[]; responses: string[] }> = [

  // ── Anxiety ──────────────────────────────────────────────────────────────────
  {
    keywords: ["anxious", "anxiety", "worried all the time", "constant worry", "nervous", "on edge", "tense"],
    responses: [
      "I hear you — persistent anxiety is genuinely exhausting. Your nervous system is stuck in alarm mode, and that takes a real physical and mental toll.\n\n**Right now, try box breathing**:\nInhale 4 counts → Hold 4 → Exhale 4 → Hold 4. Repeat 4–5 times. This directly activates your parasympathetic nervous system.\n\n**This week**:\n• Limit caffeine — it significantly amplifies anxiety.\n• Try 'worry time': schedule 15 dedicated minutes to worry. When anxious thoughts arise outside that window, tell yourself 'I'll deal with this at 4pm.' This teaches your brain worries can wait.\n• 20 minutes of walking releases tension stored in the body.\n\nIf anxiety has persisted for 2+ weeks and is interfering with your life, speaking with a therapist (CBT specifically) or doctor can make a real difference. What's been triggering the anxiety most?",

      "Anxiety that won't let up is your mind's alarm system stuck in the 'on' position — even when there's no immediate threat. That's exhausting and disorienting.\n\n**The 5-4-3-2-1 grounding technique** pulls you into the present moment:\n• 5 things you can see\n• 4 you can physically touch\n• 3 you can hear\n• 2 you can smell\n• 1 you can taste\n\nThis works because anxiety lives in 'what if' thinking (future) or replaying (past). Grounding interrupts the loop.\n\n**Longer term**: CBT (Cognitive Behavioral Therapy) rewires anxious thought patterns over 8–12 weeks. Many people see significant reduction. Are you currently working with anyone, or would you like guidance on finding support?"
    ]
  },

  // ── Panic ─────────────────────────────────────────────────────────────────────
  {
    keywords: ["panic", "panic attack", "panicking", "heart pounding", "can't catch breath", "feel like i'm dying"],
    responses: [
      "If you're panicking right now — your body's alarm system is misfiring. You are **not** dying. You are **not** going crazy. This will pass.\n\n**Do this now**:\n1. Breathe OUT first — a long, slow exhale activates calm (try: inhale 4, exhale 6–8).\n2. Feel your feet on the floor. Press them down. Notice the texture.\n3. Name 5 things you can see right now. Say them aloud or in your head.\n\nPanic attacks typically peak within 10 minutes and fully resolve within 20–30. Your body physically cannot sustain this state indefinitely.\n\nYou've survived every panic attack you've ever had. You'll survive this one too. Are you somewhere safe right now?"
    ]
  },

  // ── Depression & sadness ─────────────────────────────────────────────────────
  {
    keywords: ["depressed", "depression", "so sad", "feel sad", "feeling down", "i'm sad", "deep sadness"],
    responses: [
      "Thank you for trusting me with this. What you're carrying sounds really heavy — and I want you to know that reaching out, even here, matters.\n\nDepression has a way of making everything feel flat, hopeless, and permanent. That's the illness distorting your perception, not the truth about your future.\n\n**Gentle starting points**:\n• **Behavioral activation**: Do one small thing today — a short walk, making tea, texting one person. Depression reduces activity, which deepens depression. Any movement breaks the cycle.\n• **Don't isolate**: Depression tells you to hide. One brief human connection per day fights it.\n• **Routine**: Predictable structure (consistent sleep and meal times) stabilizes mood more than people expect.\n\nDepression is treatable — most people improve significantly with therapy, medication, or both. Have you spoken with a doctor or therapist about what you're experiencing?\n\n⚠️ If you're having thoughts of harming yourself, please call or text **988** right away.",

      "I hear you. Sadness that settles in and won't lift is one of the hardest things to carry — especially because depression makes it hard to believe it will ever change.\n\nBut here's what we know: depression is one of the most treatable mental health conditions. Most people respond well to therapy (especially CBT), medication, or both. The brain can change.\n\n**For right now**:\n• Be kind to yourself — depression is not weakness or failure.\n• Try to get some light today, even 10 minutes outside.\n• Notice if there's one person you could send a short message to — connection fights isolation.\n\nWhat's been happening that's brought you to this low point? I'm here to listen."
    ]
  },

  // ── Feeling overwhelmed ───────────────────────────────────────────────────────
  {
    keywords: ["overwhelmed", "too much", "can't cope", "everything is too much", "breaking point", "can't handle it"],
    responses: [
      "When everything feels like too much, the first thing to do is stop trying to solve all of it at once — because your brain can't.\n\n**Try this**:\n1. **Name what's overwhelming you** — write it down, all of it. Getting it out of your head and onto paper reduces the weight.\n2. **Sort into two lists**: What's urgent today? What can wait?\n3. **Pick one thing** — just one — to address first.\n\nOverwhelm is often a signal that more is being asked of you than your current capacity. That's not failure — it's information.\n\n**Breathe first**: The physiological sigh (double inhale through nose, long slow exhale) activates your calm response within seconds.\n\nWhat's the biggest thing on your plate right now?"
    ]
  },

  // ── Stress ───────────────────────────────────────────────────────────────────
  {
    keywords: ["stress", "stressed out", "cope with stress", "stressed", "pressure", "overloaded"],
    responses: [
      "Stress is your body and mind signaling that demand is exceeding resources. The signal is real — let's address both sides.\n\n**Immediate relief**:\n• Physiological sigh: double inhale through nose, then one long exhale. This deflates the 'air sacs' in your lungs that drive the stress response. Takes 10 seconds.\n• 5 minutes outside — natural light and movement reset cortisol.\n\n**Sort → Simplify → Soothe framework**:\n• **Sort**: List everything stressing you. Separate what's in your control from what isn't.\n• **Simplify**: Focus energy only on the top 1–2 controllable items today.\n• **Soothe**: One intentional recovery activity daily — movement, music, nature, connection.\n\nIs this stress coming from a specific area — work, relationships, health, finances?",

      "Chronic stress changes your brain and body over time — so this isn't something to just push through indefinitely.\n\n**Research-backed stress reducers**:\n• Mindfulness: 5 minutes of focused breath attention reduces cortisol measurably. Consistency matters more than duration.\n• Exercise: 20 minutes of anything you'll do.\n• Social connection: one genuine conversation.\n• Meaning: a small act that connects to your values.\n\nSometimes stress is about the external load — too much being asked of you. And sometimes it's about internal patterns (perfectionism, difficulty delegating, catastrophic thinking). Usually both.\n\nWhich area of your life is currently carrying the most stress?"
    ]
  },

  // ── Negative thoughts & overthinking ─────────────────────────────────────────
  {
    keywords: ["negative thoughts", "can't stop thoughts", "overthinking", "ruminating", "intrusive thoughts", "dark thoughts", "mind won't quiet"],
    responses: [
      "Thought loops — the mind replaying painful paths over and over — are exhausting. Your brain is stuck in problem-solving mode on a problem it can't solve.\n\n**Cognitive defusion (ACT technique)**:\nInstead of 'I am worthless,' try: *'I notice I'm having the thought that I am worthless.'* This small change creates distance between you and the thought. You're not the thought — you're the observer of it.\n\n**'Thank you, mind' technique**:\nWhen a negative thought arrives: 'Thank you, mind, for trying to protect me.' Acknowledge it — don't fight it. Then gently redirect attention.\n\n**Schedule worry time**: 15 minutes daily. When thoughts appear outside that window, say 'I'll address this at my worry time.' With practice, thoughts learn to wait.\n\nIs there a specific theme your thoughts keep returning to? Sometimes naming the core fear underneath the loop helps.",

      "The 'pink elephant problem': the more we try to suppress thoughts, the more they intrude. Suppression backfires.\n\nThe more effective approach is **acknowledgment without engagement**:\n1. Notice: 'There it is again.'\n2. Label: 'This is an anxious thought / self-critical thought / catastrophic thought.'\n3. Let it pass without arguing, analyzing, or following it.\n\nThoughts are like weather — they arise and pass. You don't have to believe every thought you have.\n\n**Also check the basics**: Sleep deprivation and low blood sugar dramatically worsen rumination. How have you been sleeping and eating? These matter more than people realize."
    ]
  },

  // ── Sleep ─────────────────────────────────────────────────────────────────────
  {
    keywords: ["sleep", "can't sleep", "insomnia", "trouble sleeping", "sleep problems", "no sleep", "sleep deprived"],
    responses: [
      "Sleep struggles are deeply frustrating — and poor sleep makes everything else harder: mood, focus, impulse control, emotional regulation.\n\n**Most evidence-backed change**: Consistent wake time every single day (including weekends). This anchors your circadian rhythm more than any other intervention.\n\n**Evening habits that work**:\n• No caffeine after 2pm.\n• No screens 30–60 minutes before bed (blue light suppresses melatonin).\n• Keep bedroom cool (65–68°F), dark, and quiet.\n• If you can't sleep after 20 minutes — get up, do something boring in dim light, return when genuinely sleepy. Don't lie awake fighting it.\n\nCBT-I (Cognitive Behavioral Therapy for Insomnia) outperforms sleep medication long-term. How long has sleep been a problem for you?",

      "Running on poor sleep affects your mental health just as much as any other factor — sometimes more. It's worth treating seriously.\n\n**Pre-sleep wind-down (60 minutes before bed)**:\n1. Dim the lights throughout your home.\n2. Write tomorrow's task list — this empties your working memory.\n3. Warm shower (the cooling afterward signals your brain to sleep).\n4. Brief relaxation: 4-7-8 breathing (inhale 4, hold 7, exhale 8) or progressive muscle relaxation.\n\n**Middle of the night waking**: Don't check the clock. Focus on breathing and body relaxation without pressure to fall asleep. If awake 20+ minutes, briefly get up.\n\nAre you having trouble falling asleep, staying asleep, or both?"
    ]
  },

  // ── Loneliness ────────────────────────────────────────────────────────────────
  {
    keywords: ["lonely", "alone", "isolated", "loneliness", "no one", "no friends", "no connection", "feel disconnected"],
    responses: [
      "Loneliness activates the same brain regions as physical pain — this is not just 'in your head.' It's a fundamental human need signaling that it's unmet.\n\nYou're not alone in feeling alone — loneliness is widespread, but it's rarely talked about honestly.\n\n**Building connection**:\n• Join a recurring activity (weekly class, club, volunteer shift) — repeated contact with the same people is how adult friendships form.\n• Reach out to one person from your past with a simple 'Hey, I was thinking of you.' Response rates are higher than people expect.\n• Small interactions matter: a genuine exchange with a cashier or neighbor activates the same social brain circuits as close friendship.\n\nTherapy can also help address any patterns that make connection feel harder or less safe. What's been getting in the way of connection for you?",

      "I'm glad you shared this — loneliness takes real courage to admit, especially in a world where everyone appears connected.\n\nLoneliness is often about the *quality* of connection, not just quantity. You might be surrounded by people and still feel profoundly unseen.\n\n**What tends to help**:\n• Vulnerability (small doses): sharing something real, not just surface-level conversation — this is how deeper connection forms.\n• Shared purpose: volunteering, causes, creative groups — working toward something together creates natural bonds.\n• Online communities around genuine interests can create real connection when local options feel limited.\n\nSometimes loneliness also signals it's time to reconnect with yourself — through journaling, creative expression, or exploring what you genuinely value. What kind of connection are you most missing?"
    ]
  },

  // ── Confidence & self-worth ────────────────────────────────────────────────────
  {
    keywords: ["confidence", "self-confidence", "self-esteem", "low self worth", "believe in myself", "insecure", "not good enough"],
    responses: [
      "Self-confidence isn't a feeling that arrives before action — it's a feeling that follows action. You build it by doing things slightly before you feel ready and surviving.\n\n**Daily practices**:\n• **Evidence log**: Each day, write 1–2 things you handled. Over weeks, this counters the inner critic with actual data.\n• **Act first**: Do the thing slightly before you feel ready. Confidence follows.\n• **Limit social comparison** — especially social media, which is a highlight reel, not reality.\n• **Body language**: Upright posture and open body language genuinely change how you feel within minutes.\n\nConfidence also grows from identity clarity — knowing what you value, not just what you can perform. Is there a specific area where low confidence is having the most impact?",

      "Low confidence often has roots in old messages — from critical caregivers, early failures, or environments where your worth felt conditional on performance.\n\n**A powerful reframe**:\nImagine a close friend came to you with the exact same self-doubts you're carrying. What would you tell them? Now — can you offer yourself that same compassion?\n\nThe inner critic often sounds like protection, but it's actually a barrier. Research shows self-compassion (treating yourself kindly when you struggle) builds better long-term resilience than harsh self-criticism.\n\nCBT and ACT therapy are both highly effective for building sustainable self-esteem. Where does this show up most painfully in your life?"
    ]
  },

  // ── Grief & loss ──────────────────────────────────────────────────────────────
  {
    keywords: ["grief", "loss", "lost someone", "death of", "mourning", "bereavement", "miss them", "they died", "passed away"],
    responses: [
      "Grief is love with nowhere to go. What you're feeling right now is a measure of how much you cared — and there's no right way to grieve, no timeline you need to follow.\n\nGrief doesn't move in clean stages. It comes in waves — sometimes you'll feel okay, then it crashes over you again without warning. Anniversaries, songs, ordinary moments can bring it rushing back even years later. This is completely normal.\n\n**What helps**:\n• Allow yourself to feel it — suppressing grief prolongs it.\n• Talk about the person you've lost — keeping their memory alive is healing.\n• Accept that grief and brief moments of joy can coexist without guilt.\n• Be patient with yourself around 'triggers.'\n\nIf grief is significantly disrupting daily functioning for many months, grief-specialized counseling helps. Would you like to share about who you've lost?"
    ]
  },

  // ── Relationships ─────────────────────────────────────────────────────────────
  {
    keywords: ["relationship", "breakup", "divorce", "partner problems", "toxic relationship", "conflict with partner"],
    responses: [
      "Relationship pain — whether a breakup, ongoing conflict, or a toxic dynamic — can be some of the most intense emotional pain there is. It's real and it's valid.\n\n**After a breakup or loss**:\n• Allow yourself to grieve — this is a real loss, not something to 'get over.'\n• Limit contact (checking their social media prolongs pain — your brain needs space to detach).\n• Reconnect with who you are outside of that relationship.\n\n**For ongoing conflict**:\n• Use 'I feel...' statements: 'I feel unheard when...' instead of 'You always...'\n• Choose the right time — not when tired, hungry, or already escalated.\n• Couples therapy (Gottman Method or EFT) is highly effective. Most couples wait too long to seek it. Earlier is better.\n\nWhat aspect of the relationship is weighing on you most right now?"
    ]
  },

  // ── Work & career ─────────────────────────────────────────────────────────────
  {
    keywords: ["work", "job stress", "career", "boss", "workplace", "work pressure", "fired", "unemployed", "job anxiety"],
    responses: [
      "Work stress is all-consuming, especially when your livelihood or identity is tied to it — and your mental health matters more than any job.\n\n**For immediate overwhelm**:\n• 'Minimum viable day': identify the 1–3 things that truly must happen today. Let the rest go temporarily.\n• Micro-breaks every 90 minutes (5 minutes walking or stretching) — this is backed by performance research, not just wellness advice.\n\n**For ongoing/chronic work stress**:\n• Clarify what's in your control vs. not — direct energy only to the former.\n• Protect non-work time like it matters — because it does.\n• If the environment is genuinely toxic (not just hard) — document, know your options, consider your path.\n\nIs this stress coming from workload, relationships at work, job security, or something else?"
    ]
  },

  // ── Trauma ────────────────────────────────────────────────────────────────────
  {
    keywords: ["trauma", "ptsd", "flashback", "past abuse", "childhood abuse", "assault", "triggered by past"],
    responses: [
      "Trauma stays in the body and mind long after the event itself — your reactions make complete sense given what you experienced. This isn't weakness or being 'stuck.'\n\n**Important to know**:\n• Trauma responses (flashbacks, hypervigilance, avoidance, emotional numbing) are your nervous system's protective adaptations — not signs of brokenness.\n• Healing is absolutely possible with the right support.\n\n**Evidence-based treatments that work**:\n• EMDR (Eye Movement Desensitization and Reprocessing)\n• Trauma-focused CBT\n• CPT (Cognitive Processing Therapy)\n• Somatic therapies\n\n**For right now, if triggered**: Feel your feet on the floor. Name 5 things you can see. Hold something with texture. Say: 'I am safe right now. This is a memory, not reality.'\n\nNot all therapists are trained in trauma — look specifically for 'trauma-informed' or 'trauma-specialized' clinicians. Are you currently working with anyone?"
    ]
  },

  // ── Greetings & openers ───────────────────────────────────────────────────────
  {
    keywords: ["hi", "hello", "hey", "hiya", "good morning", "good evening", "morning", "evening"],
    responses: [
      "Hello! I'm really glad you're here. 💙\n\nThis is a safe, judgment-free space where you can share whatever's on your mind — big feelings, small worries, or things you haven't quite found words for yet.\n\nHow are you feeling today? You can be as honest as you like.",

      "Hi there! Welcome. 💙\n\nI'm MindMate's AI Mental Health Assistant — here to listen and offer support around mental wellbeing. Everything you share is private.\n\nHow are you doing today? What brought you here?"
    ]
  },

  // ── Struggling generally ──────────────────────────────────────────────────────
  {
    keywords: ["i'm struggling", "struggling", "going through a lot", "having a hard time", "hard time right now", "not doing well", "not okay"],
    responses: [
      "I'm really glad you said that — it took something to write those words. Acknowledging that you're struggling is the first step toward getting through it.\n\nYou don't have to have it figured out. You don't have to explain it perfectly. Just start somewhere — tell me what's been the hardest part lately. I'm here and I'm listening.",

      "Thank you for being honest about that. So many people are carrying hard things while pretending everything is fine — the fact that you're willing to say 'I'm struggling' is real courage.\n\nI'd like to understand what's going on for you. What's been weighing on you most? It can be one thing or a mix of many — just start anywhere."
    ]
  },

  // ── Need help / support ───────────────────────────────────────────────────────
  {
    keywords: ["need help", "please help me", "i need support", "help me please", "don't know what to do"],
    responses: [
      "I'm here. You reached out, and that matters more than you might realize right now.\n\nCan you tell me what's going on? Even if it's complicated, messy, or hard to put into words — start anywhere. What's been the most difficult thing lately?",

      "You asked for help — that took courage, and I want to make sure you get it.\n\nTell me what's happening. What's been the hardest part of what you're going through? I'm listening without judgment, and we'll figure out what kind of support makes sense from here."
    ]
  },

  // ── Feeling sad/down ─────────────────────────────────────────────────────────
  {
    keywords: ["feel sad", "feeling sad", "so sad", "i'm sad", "feeling down", "feel down", "feeling blue", "low mood"],
    responses: [
      "I'm sorry you're feeling this way. Sadness is one of the most human emotions — and sometimes it asks to be felt, not fixed right away.\n\nCan you tell me more about what's making you sad? Is this connected to something specific — a loss, a situation, a relationship? Or does it feel more like a general heaviness that's been settling in?\n\nI'm here to listen without rushing you toward solutions.",

      "Thank you for telling me. Sadness that persists deserves attention, not dismissal.\n\nA few gentle questions that might help us understand what's happening:\n• How long have you been feeling this way?\n• Is there something that triggered it, or did it creep in gradually?\n• Is it there all the time, or does it lift sometimes?\n\nYou don't have to answer all of these — just share whatever feels most relevant."
    ]
  },

  // ── Forgiveness ──────────────────────────────────────────────────────────────
  {
    keywords: ["forgiveness", "can't forgive", "how to forgive", "forgive someone", "forgive myself", "unforgiveness"],
    responses: [
      "Forgiveness is one of the most misunderstood ideas in mental health.\n\n**What forgiveness is**: Releasing the resentment that keeps *you* imprisoned — for your sake, not for the person who hurt you. It doesn't mean what happened was okay.\n\n**What forgiveness is not**: Condoning the harm. Reconciling with the person. Pretending it didn't matter.\n\nYou can forgive someone and still maintain distance. You can forgive and still feel angry about the injustice. You can forgive without ever telling them.\n\nForced forgiveness before you're ready is suppression, not healing. Where are you in this process — who or what are you working to forgive?"
    ]
  },

  // ── Body image ────────────────────────────────────────────────────────────────
  {
    keywords: ["body image", "hate my body", "feel fat", "weight concerns", "body shame", "don't like my appearance"],
    responses: [
      "Body dissatisfaction is incredibly common — and largely driven by unrealistic, heavily filtered media that bears little resemblance to real human bodies.\n\n**Shifting the relationship with your body**:\n• **Function focus**: What can your body *do*? Walk, hug someone, breathe, heal?\n• **Curate your media**: Follow accounts that show real, diverse bodies. The research is clear — this matters.\n• **Language check**: Notice when you talk about your body with contempt. Try neutral ('my body does this') rather than judgmental ('my body is wrong').\n\nIf body image is significantly affecting your life, a therapist working from a Health at Every Size (HAES) perspective can help. What aspect of this feels hardest right now?"
    ]
  }
];

// ─── General fallback responses ──────────────────────────────────────────────

const generalResponses = [
  "Thank you for sharing that with me. Mental health is deeply personal, and I want to make sure I understand what you're going through.\n\nTo help me support you better, could you tell me:\n• How long have you been feeling this way?\n• Did something specific trigger it, or has it been building gradually?\n• What's been the hardest part?\n\nI'm here to listen and offer whatever support I can.",

  "I appreciate you opening up. Whatever you're going through, you don't have to navigate it alone.\n\nSome foundations that support mental wellbeing across almost every challenge:\n• **Sleep**: 7–9 hours is foundational — almost every mental health issue worsens with poor sleep.\n• **Movement**: Even 20–30 minutes of walking daily has measurable effects on mood.\n• **Connection**: One genuine interaction with someone who matters to you.\n• **Compassion toward yourself**: You're doing harder things than you give yourself credit for.\n\nIs there something specific on your mind you'd like to explore?",

  "I'm here for you. What you're feeling is valid — reaching out takes courage, and it's an important step.\n\nEveryone struggles at points. The fact that you're here, trying to understand and address what you're going through, reflects real strength.\n\nShare as much or as little as you'd like. We can talk through what's happening, explore coping tools, or I can point you toward professional resources — whatever is most helpful right now.",

  "That sounds like a lot to be carrying. You don't have to figure it all out at once.\n\nSometimes the most helpful thing is simply having a space where you can say what's actually true without editing it or worrying about burdening someone.\n\nTell me what's been going on. Start anywhere — the beginning, the middle, what's heaviest right now. I'm listening."
];

// ─── Core matching logic ──────────────────────────────────────────────────────

function getAIResponse(message: string): { response: string; category: string; isCrisis: boolean } {
  // Layer 1: Primary keyword map (includes all crisis entries)
  const keywordMatch = matchKeywordResponse(message);
  if (keywordMatch) {
    return keywordMatch;
  }

  // Layer 2: Rich detailed multi-response categories
  const lowerMsg = message.toLowerCase();
  for (const category of detailedResponses) {
    if (category.keywords.some((kw) => lowerMsg.includes(kw))) {
      const responses = category.responses;
      const response = responses[Math.floor(Math.random() * responses.length)];
      console.log(`[AI] Detailed match — keywords: ${category.keywords.slice(0, 2).join(", ")}`);
      return { response, category: "DETAILED", isCrisis: false };
    }
  }

  // Layer 3: General + imported fallbacks
  const allFallbacks = [...generalResponses, ...fallbackResponses];
  const response = allFallbacks[Math.floor(Math.random() * allFallbacks.length)];
  console.log("[AI] Fallback response");
  return { response, category: "FALLBACK", isCrisis: false };
}

// ─── Route ────────────────────────────────────────────────────────────────────

router.post("/chat", authenticate, async (req: any, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const { response, category, isCrisis } = getAIResponse(message.trim());

    // Crisis responses are immediate. Others get a natural typing delay.
    if (!isCrisis) {
      await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 700));
    }

    res.json({
      success: true,
      response,
      category,
      isCrisis,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("AI chat error:", error);
    res.status(500).json({ success: false, message: "Failed to process your message" });
  }
});

export default router;

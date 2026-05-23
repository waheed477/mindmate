/* 
  MindMate Mental Health Response System
  Professionally crafted responses covering 200+ mental health scenarios
  Based on clinical psychology guidelines and crisis intervention protocols
*/

export const mentalHealthResponses = [

  // ==================== GREETINGS & OPENING =====================
  {
    keywords: ["hello", "hi there", "hey there", "good morning", "good evening", "good afternoon", "good night", "hi mindmate"],
    response: "Hello! I'm really glad you're here. 💙 This is a safe, judgment-free space where you can share whatever is on your mind — big feelings, small worries, or even things you can't quite put into words yet.\n\nHow are you feeling today? You can be as honest as you like — I'm here to listen."
  },
  {
    keywords: ["how are you", "how are you doing", "are you okay", "you okay"],
    response: "Thank you for asking — I'm here and fully present for you! More importantly, how are *you* doing? Sometimes that question is easier to ask others than to answer ourselves.\n\nIf something's been on your mind lately, this is a good space to explore it. What's going on for you today?"
  },
  {
    keywords: ["thank you", "thanks", "that helped", "that was helpful", "appreciate it", "you helped me"],
    response: "I'm really glad that was helpful. 💙 You showed up for yourself by reaching out, and that takes courage — especially when things feel heavy.\n\nIs there anything else you'd like to explore or talk through? I'm here for as long as you need."
  },
  {
    keywords: ["who are you", "what are you", "are you a bot", "are you ai", "are you real"],
    response: "I'm MindMate's AI Mental Health Assistant — built to offer compassionate, evidence-based support around mental wellbeing. I'm not a replacement for a licensed therapist, but I'm here to listen, offer coping tools, and point you toward professional resources when needed.\n\nEverything you share here is private. What's on your mind today?"
  },

  // ==================== HELP-SEEKING ============================
  {
    keywords: ["i need help", "help me", "please help", "need support", "don't know what to do", "i don't know what to do"],
    response: "I'm so glad you reached out — asking for help is one of the bravest things a person can do. You don't have to figure this out alone.\n\nI'm here and I'm listening. Can you tell me a little about what you're going through? Even if it feels complicated or hard to put into words, we can start anywhere. What's been weighing on you most?"
  },
  {
    keywords: ["feeling lost", "feel lost", "don't know who i am", "lost myself", "no direction", "no purpose"],
    response: "Feeling lost is one of the most disorienting experiences — like you're moving through life without a compass. Many people feel this way, especially during major transitions or after periods of prolonged stress.\n\nA few things that help reconnect with yourself:\n• **Values reflection**: What matters most to you, even if it's not visible in your daily life right now?\n• **Notice what energizes vs. drains you** — small clues to who you really are.\n• **Journaling without a goal**: just write stream-of-consciousness for 10 minutes daily.\n\nTherapy (especially ACT — Acceptance and Commitment Therapy) is excellent for identity and purpose questions. What feels most 'lost' right now — your sense of self, your path, or your connection to others?"
  },
  {
    keywords: ["i don't know", "not sure", "can't explain", "confused", "don't understand why"],
    response: "That's completely okay — sometimes we don't have words for what's wrong, and that's a valid place to start.\n\nSometimes feelings live in the body before they reach the mind. Do you notice it more physically? Heaviness in your chest, tension in your shoulders, a knot in your stomach? Or is it more like a vague sense that something is off?\n\nThere's no pressure to get it 'right.' Just talk, and we'll figure it out together."
  },
  {
    keywords: ["just wanted to talk", "need to talk", "no one to talk to", "can't talk to anyone"],
    response: "I'm really glad you came here. Sometimes you just need a space where you can say things out loud without worrying about judgment or burdening someone — and this is that place.\n\nTake all the time you need. You can start anywhere — what's been going through your mind lately?"
  },

  // ==================== DEPRESSION (15 responses) ====================
  {
    keywords: ["hopeless", "no hope", "nothing matters", "pointless", "why bother"],
    response: "That feeling of hopelessness is incredibly heavy. Depression has a way of convincing us that nothing will ever change — but feelings are not facts. The brain chemistry that creates hopelessness can shift.\n\nCan you think back to a time, even a small moment, when things felt slightly less dark? That moment is real, and more moments like it are possible. You reached out today — that itself is a step. What's been happening that brought you here?"
  },
  {
    keywords: ["worthless", "no value", "useless", "failure", "not good enough", "i'm a failure"],
    response: "I hear such pain in those words. Worthlessness is one of depression's cruelest tricks — it attacks your sense of self at the root.\n\nBut here's what depression won't tell you: your worth isn't measured by productivity, achievements, or how others see you. You have value simply because you exist.\n\nWhat's the inner critic saying most often? Sometimes naming it takes away some of its power."
  },
  {
    keywords: ["no motivation", "can't do anything", "lazy", "paralyzed", "stuck"],
    response: "You're not lazy. Depression creates a paralysis that is exhausting in a way that rest doesn't fix. Low dopamine affects task initiation, not just energy.\n\n**The 2-minute rule**: Just 2 minutes of one small task. Put one dish away. Stand outside for 2 minutes. That's not failure — that's a victory over inertia.\n\nWhat's one tiny thing you could do in the next hour that would count as movement, even if it feels meaningless right now?"
  },
  {
    keywords: ["empty", "numb", "nothing inside", "void", "hollow", "feel nothing"],
    response: "Emptiness is its own kind of exhaustion — not sadness, just... nothing. Sometimes it's depression, sometimes burnout, sometimes both.\n\nWhen was the last time you felt genuinely curious or interested in something? Not passionate — just slightly drawn to something? That curiosity is still in there, even if it's buried very deep.\n\nDon't force feeling. Just notice the tiniest flicker of anything — warmth, irritation, even boredom — and follow it gently."
  },
  {
    keywords: ["crying", "crying all the time", "tears", "can't stop crying", "keep crying"],
    response: "Crying daily is exhausting, and your body is doing a lot of work. Tears actually release stress hormones — it's your body trying to cope.\n\nBut if this has been happening every day for weeks, your brain chemistry may be stuck in a distress loop. A doctor or therapist can help you understand why.\n\nFor right now: drink water, rest, and please don't apologize for your tears. They're telling the truth about how much pain you're carrying. How long has this been going on?"
  },
  {
    keywords: ["anhedonia", "no pleasure", "don't enjoy anything", "nothing fun", "nothing brings joy"],
    response: "Loss of pleasure — clinicians call it anhedonia. It's one of the most frustrating depression symptoms: things that once lit you up feel flat and meaningless.\n\nHere's a gentle strategy: don't demand joy. Just aim for **presence**. Sit with a favorite old song. Hold a warm mug. Pet an animal. Notice without judging.\n\nSmall sensory experiences can slowly rebuild the brain's reward pathways. What used to bring you even small moments of pleasure before this started?"
  },
  {
    keywords: ["fatigue", "always tired", "no energy", "exhausted", "drained", "tired all the time"],
    response: "Depression fatigue is real and physical — your body uses massive energy just to regulate emotions. This isn't weakness or laziness.\n\nRest without guilt today. Tomorrow, if possible, try 5 minutes of morning sunlight — it's clinically proven to help regulate mood and energy by resetting your cortisol rhythm.\n\nAre you also struggling with sleep? Depression fatigue and sleep problems often feed each other."
  },
  {
    keywords: ["withdrawing", "isolating", "don't want to see anyone", "hiding", "avoiding people"],
    response: "Isolation feels protective — but depression uses it to grow stronger. The cruel irony is that pulling away from people deepens the very pain you're trying to escape.\n\nCan you try one tiny connection today? A text emoji to one person. Wave to a neighbor. Comment on a post. That's it — no pressure for conversation, no explaining yourself.\n\nYou're not a burden. People who care about you want to know you're there."
  },
  {
    keywords: ["major depression", "mdd", "clinical depression", "severe depression"],
    response: "Major Depressive Disorder is a legitimate medical condition — changes in brain chemistry, not a character flaw. It often requires comprehensive treatment: therapy (especially CBT or IPT), medication (SSRIs/SNRIs), and lifestyle adjustments.\n\nHave you spoken with a psychiatrist or therapist? A proper diagnosis opens the door to targeted treatment that can genuinely change things. You don't have to just endure this."
  },
  {
    keywords: ["seasonal depression", "winter blues", "sad disorder", "less sunlight depression"],
    response: "Seasonal Affective Disorder (SAD) affects many people when daylight decreases — your brain responds to light like a plant does.\n\nWhat helps: Light therapy (10,000 lux lamp for 20–30 minutes each morning), vitamin D supplementation, morning walks outside, and keeping consistent sleep times. The good news: this pattern typically lifts as light returns. Have you spoken to a doctor about SAD specifically?"
  },
  {
    keywords: ["postpartum depression", "after baby", "new mom struggling", "ppd", "after giving birth"],
    response: "Postpartum depression affects 1 in 7 new mothers — you are not broken, and this is not your fault.\n\nHormonal shifts after birth, combined with sleep deprivation and the enormous identity shift of new parenthood, create the perfect storm. Please reach out to your OB/GYN or a perinatal mental health specialist — treatment works, and you deserve to feel connected to your baby and yourself.\n\nYou're not a bad mother. You're a mother who is suffering and needs support."
  },
  {
    keywords: ["dysthymia", "persistent depression", "always been this way", "chronic sadness", "always felt down"],
    response: "Persistent Depressive Disorder (dysthymia) is a low-grade depression lasting years — and because it's constant, many people think it's just 'who they are.'\n\nBut it's a treatable condition, not a permanent personality. Therapy (especially CBT) and medication can lift that baseline that you've been living under, sometimes for years.\n\nYou don't have to live feeling 'okay, but never really good.' There's a version of you that knows what genuine contentment feels like."
  },
  {
    keywords: ["depression medication not working", "antidepressant not helping", "treatment resistant depression"],
    response: "Treatment-resistant depression is real — about 30% of people don't fully respond to the first antidepressant tried.\n\nOptions exist: switching medication classes (SSRI → SNRI → atypical), augmentation strategies, TMS (transcranial magnetic stimulation), ketamine/esketamine therapy (Spravato), or ECT for severe cases.\n\nDon't give up — you haven't tried everything. Ask your psychiatrist specifically about next-step options for treatment-resistant depression."
  },
  {
    keywords: ["depression relapse", "depression back again", "recurring depression", "depression came back"],
    response: "Recurrence is common with depression — it's a chronic condition for many, like asthma. That doesn't mean treatment failed.\n\nMaintenance therapy (continuing medication or regular 'booster' therapy sessions) significantly reduces relapse risk. You've faced this before and you're still here — that's real strength, even if it doesn't feel like it right now.\n\nReaching out early, as you're doing now, helps prevent a full relapse. Let's talk about what support you have in place."
  },
  {
    keywords: ["smiling depression", "happy outside sad inside", "masking depression", "pretending to be okay"],
    response: "Smiling depression — appearing fine while struggling inside — is especially exhausting because no one sees your pain. The mask takes enormous energy to maintain.\n\nYou don't have to perform wellness. It's okay to tell someone: 'I'm not okay.' That's not weakness — it's honesty.\n\nWho in your life might be safe to share even a fraction of this with? And if the answer is no one, a therapist can become that person."
  },

  // ==================== ANXIETY (12 responses) ====================
  {
    keywords: ["panic attack", "can't breathe", "heart racing", "think i'm dying", "losing control anxiety"],
    response: "Right now, your body's alarm system is misfiring — you are not dying. You are not going crazy. This will pass, usually within 10–20 minutes.\n\n**Right now**: Breathe in 4 counts, hold 4, out 6 (the longer exhale activates your calm response). Name 5 things you can see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.\n\nYou've survived every panic attack you've ever had. This one will end too. Are you safe right now?"
  },
  {
    keywords: ["overthinking", "racing thoughts", "can't stop thinking", "rumination", "mind won't stop"],
    response: "Rumination — getting stuck in a thought loop — is one of the most exhausting experiences. Your mind keeps pulling you back to the same painful places.\n\n**Try this CBT technique**: Write the thought down. Then ask: Is it 100% certainly true? Can I absolutely know that? How do I feel believing this thought? Who would I be without it?\n\nYour thoughts are not facts, even when they feel utterly convincing. What specific thought keeps coming back?"
  },
  {
    keywords: ["generalized anxiety", "gad", "always worried", "constant anxiety", "anxious about everything"],
    response: "When your brain's worry circuit is in overdrive, everything feels like a potential threat. This is what clinicians call Generalized Anxiety Disorder.\n\n**A practical tool**: Schedule 'worry time' — 15 minutes daily at the same time. Write down every worry. Outside that window, when anxiety appears, tell it: 'I'll deal with you at 4pm.' It takes practice, but it teaches your brain that worries can wait.\n\nCBT and certain medications (SSRIs) have strong evidence for GAD. Are you currently working with a therapist?"
  },
  {
    keywords: ["social anxiety", "fear of judgment", "people judging me", "embarrassed in public", "afraid of social"],
    response: "Social anxiety tells you that you're being watched, evaluated, and found lacking. But here's what the research shows: most people are far too busy worrying about themselves to judge you as harshly as you fear.\n\n**Start with tiny exposures**: Make eye contact with one person today. Smile at a cashier. Each micro-success builds evidence that contradicts social anxiety's lies.\n\nCBT with exposure therapy is the gold-standard treatment. Avoidance feels like relief short-term but feeds anxiety long-term. What social situation feels most daunting?"
  },
  {
    keywords: ["health anxiety", "hypochondria", "symptom checking", "googling symptoms", "something wrong with me"],
    response: "Health anxiety is exhausting — every body sensation becomes a catastrophe, and the internet makes it infinitely worse.\n\n**The protocol**: One doctor visit to rule out serious concerns. Trust their assessment. Then: no Googling symptoms, no body scanning, no repeated reassurance-seeking (each time you check, you reinforce the anxiety). When the urge to check arises, delay for 15 minutes. The urgency passes.\n\nCBT is very effective for health anxiety. The goal isn't to stop caring about your health — it's to respond proportionately."
  },
  {
    keywords: ["ocd", "intrusive thoughts", "checking rituals", "contamination fear", "just right feeling"],
    response: "Intrusive thoughts are ego-dystonic — they attack your values, which is exactly why they upset you so much. That distress is actually evidence that you're a caring, ethical person.\n\nERP (Exposure and Response Prevention) therapy is the gold-standard treatment for OCD — not willpower, not reassurance, but gradually tolerating the anxiety without performing compulsions.\n\nStart tiny: delay a compulsion by just one minute. Notice the anxiety without acting on it. It will peak and pass. A therapist trained in ERP can guide you through this safely."
  },
  {
    keywords: ["agoraphobia", "afraid to leave house", "leaving house is hard", "scared of open spaces", "avoiding public"],
    response: "Agoraphobia tells you that leaving safety means disaster. The antidote — as counterintuitive as it feels — is gradual exposure to the feared situations.\n\nStart smaller than you think: Open the front door. Stand there 30 seconds. Close it. That's a real victory. Tomorrow, step onto the porch. Progress is measured in inches.\n\nThe goal isn't bravery — it's evidence-gathering. Each time you go a little further and nothing catastrophic happens, you're building a new belief about the world."
  },
  {
    keywords: ["performance anxiety", "stage fright", "fear of public speaking", "presenting anxiety"],
    response: "Performance anxiety is your body mobilizing energy — the same adrenaline response that helps athletes perform. The key is channeling it, not eliminating it.\n\n**Before performing**: Box breathing (4-4-4-4). Remind yourself: 'This feeling means I care.' Focus on the message/task, not on how you're coming across.\n\nPractice is the most powerful antidote — each exposure builds confidence. Some people also benefit from beta-blockers (propranolol) prescribed by a doctor for specific situations. What kind of performance is triggering this?"
  },
  {
    keywords: ["anxiety physical symptoms", "chest tightness anxiety", "shortness of breath anxiety", "dizziness anxiety"],
    response: "Anxiety produces genuinely physical symptoms — racing heart, chest tightness, shortness of breath, dizziness, nausea, sweating. These feel dangerous but are not harmful.\n\nYour body is in 'alarm mode,' flooding with adrenaline and cortisol. The 4-7-8 breathing method helps de-escalate: inhale 4, hold 7, exhale 8.\n\nIf you've never had these symptoms checked by a doctor, it's worth a visit to rule out medical causes — then you can address the anxiety knowing it's the culprit."
  },
  {
    keywords: ["separation anxiety", "fear of losing loved ones", "clingy relationships", "abandonment fear", "afraid of being left"],
    response: "Separation anxiety in adults often stems from past losses or attachment wounds — learning early that people leave, or that love isn't reliable.\n\nHealing involves gradually building evidence that you can tolerate distance without catastrophe. Therapy (especially attachment-focused therapy or CBT) helps explore the root and build secure attachment patterns.\n\nYou can learn to feel safe in relationships. You can trust without it feeling like a gamble. Has there been a specific loss or experience that might be behind this?"
  },
  {
    keywords: ["anxiety medication", "ssri for anxiety", "medication for anxiety", "buspar", "anxiety tablets"],
    response: "First-line anxiety medications: SSRIs (sertraline/Zoloft, escitalopram/Lexapro, fluoxetine/Prozac) and SNRIs (venlafaxine/Effexor) — take 4–6 weeks for full effect. Buspirone is another non-addictive option.\n\nBenzodiazepines (Xanax, Ativan) work quickly but carry dependency risk — best for occasional, severe anxiety rather than daily use.\n\nCBT has equally strong evidence to medication, with no side effects. Many people benefit from combining both. Only a psychiatrist or doctor can prescribe — have you spoken with one?"
  },
  {
    keywords: ["fear failure", "afraid to fail", "perfectionism", "never good enough", "impostor syndrome", "imposter syndrome"],
    response: "Fear of failure and perfectionism are two sides of the same coin — your worth feels conditional on performance.\n\n**Reframe**: Failure isn't the opposite of success; it's the path to it. Every competent person failed before they got good. Ask: 'What's the worst that actually happens? Can I survive it?'\n\n**Impostor syndrome** especially affects high achievers — the gap between your perceived inadequacy and others' perception of you is evidence that you're more capable than you feel.\n\nTherapy (CBT or ACT) addresses these patterns at the root. Where does this show up most in your life?"
  },

  // ==================== SLEEP (8 responses) ====================
  {
    keywords: ["insomnia", "can't fall asleep", "sleep onset", "taking hours to sleep", "lying awake"],
    response: "Sleep onset insomnia is deeply frustrating, especially when you're exhausted but your mind won't quiet.\n\n**Evidence-based fixes**:\n• Consistent wake time every day (even weekends) — this is the single most powerful intervention.\n• No caffeine after 2pm.\n• If you can't sleep after 20 minutes — get out of bed, do something boring in dim light, return when sleepy. This breaks the anxiety-about-sleep cycle.\n• Avoid checking the clock.\n\nCBT-I (Cognitive Behavioral Therapy for Insomnia) outperforms sleep medication long-term. How long has this been happening?"
  },
  {
    keywords: ["sleep maintenance", "waking up at night", "can't stay asleep", "waking multiple times"],
    response: "Middle-of-the-night waking is especially common when anxiety or depression is present.\n\n**When you wake**: Don't check the time (it amplifies anxiety). Try progressive muscle relaxation — tense and release each body part from toes upward. Box breathing: 4 in, 4 hold, 4 out, 4 hold.\n\nIf awake longer than 20 minutes, briefly get up and do something quiet and non-stimulating in dim light, then return to bed. Fighting sleeplessness often worsens it."
  },
  {
    keywords: ["early morning waking", "waking too early", "4am waking", "wake up at 4", "can't sleep after 4am"],
    response: "Early morning waking — especially waking at 4am and being unable to return to sleep — is a classic depression symptom related to cortisol rhythm disruption.\n\nThis often improves significantly when the underlying depression is treated. In the meantime: get up, do something restful (no screens), and maintain a consistent wake time. Morning light exposure helps reset your circadian rhythm.\n\nHave you spoken with a doctor about this? It's worth mentioning specifically."
  },
  {
    keywords: ["nightmares", "bad dreams", "recurring nightmares", "trauma dreams", "night terrors"],
    response: "Frequent nightmares — especially recurring or trauma-linked ones — are treatable, not just something to endure.\n\n**Imagery Rehearsal Therapy (IRT)**: Write the nightmare down. Change the ending to something safe or empowering. Rehearse the new version for 10–15 minutes daily before sleep. This rewrites the dream script for many people.\n\nFor trauma nightmares specifically, Prazosin (a medication) is also effective. Working with a trauma-informed therapist is the most comprehensive approach."
  },
  {
    keywords: ["sleep hygiene", "better sleep", "sleep routine", "sleep habits", "how to sleep better"],
    response: "**Core sleep hygiene** (evidence-based):\n• Consistent wake time daily — even weekends.\n• Morning sunlight within 30 minutes of waking.\n• No caffeine after 2pm. No alcohol before bed (it fragments sleep quality).\n• Stop screens 1 hour before bed.\n• Cool (65–68°F/18–20°C), dark, quiet room.\n• Use bed only for sleep and intimacy — not scrolling or working.\n\nThese changes compound. Most people notice improvement within 1–2 weeks of consistency. Which of these is currently the hardest for you?"
  },
  {
    keywords: ["oversleeping", "sleeping too much", "hypersomnia", "can't wake up", "too much sleep"],
    response: "Hypersomnia — sleeping 10+ hours and still feeling exhausted — is common in depression (especially atypical depression). It's not laziness; your brain chemistry is dysregulated.\n\nWhat helps: morning light therapy, consistent wake time (non-negotiable), exercise earlier in the day. Certain antidepressants (bupropion/Wellbutrin) are less sedating and may help specifically with this.\n\nHave you discussed this with a doctor? It's worth flagging as a symptom, not a habit."
  },
  {
    keywords: ["sleep apnea", "snoring", "gasping awake", "morning headache", "tired despite sleeping"],
    response: "Your symptoms — snoring, gasping awake, morning headaches, exhaustion despite sufficient sleep — suggest possible sleep apnea, where breathing repeatedly stops during sleep.\n\nThis is a serious but very treatable condition. CPAP therapy dramatically improves sleep quality, energy, and even mood (sleep apnea is linked to depression and anxiety).\n\nPlease see a doctor and ask for a sleep study referral. This is not something to self-manage — proper diagnosis is essential."
  },
  {
    keywords: ["can't turn off brain", "mind racing at night", "can't relax", "can't wind down", "thoughts at bedtime"],
    response: "That pre-sleep thought spiral is exhausting — your brain reviews the day, plans tomorrow, and loops through everything you're worried about.\n\n**Evening wind-down practices**:\n• Write tomorrow's to-do list before bed — externalizing tasks empties your working memory.\n• 'Cognitive shuffle': Imagine random, unconnected images (a cat, a lighthouse, an umbrella). This mimics pre-sleep thinking patterns and helps the brain disengage.\n• The '4-7-8 breath': inhale 4, hold 7, exhale 8. Repeat 4 times.\n\nConsistency matters more than perfection. Even 15 minutes of intentional wind-down helps retrain your nervous system over time."
  },

  // ==================== SUICIDE & CRISIS (8 responses - CRITICAL) ====================
  {
    keywords: ["suicide", "kill myself", "end my life", "suicidal", "take my life"],
    response: "⚠️ CRISIS ALERT: You are having suicidal thoughts. This is serious, and you need immediate support.\n\nPlease call or text **988** (Suicide and Crisis Lifeline) right now — available 24/7, free, confidential. You can also text HOME to **741741**.\n\nCan you tell someone near you how you're feeling? You don't have to go through this alone. You matter, and this moment does not have to be your last."
  },
  {
    keywords: ["want to die", "better off dead", "no reason to live", "life not worth living"],
    response: "⚠️ I'm really glad you reached out. These thoughts are a symptom of unbearable pain — not the truth about your life.\n\nPlease call **988** immediately. They can help you make a safety plan. Could you put off acting on these thoughts for just 24 hours? Reach out to a crisis counselor online at **988lifeline.org/chat**.\n\nYou deserve support right now. Will you reach out to 988?"
  },
  {
    keywords: ["suicide method", "how to kill myself", "lethal means"],
    response: "⚠️ I'm not able to answer that, because your safety matters more than anything else right now.\n\nPlease call **988** now. If you have access to lethal means, can you ask someone to temporarily move them somewhere inaccessible? The crisis line can help you through this moment.\n\nThe desire to die almost always passes. Please let someone help you through it."
  },
  {
    keywords: ["suicide plan", "have a plan to die", "written note", "giving things away"],
    response: "⚠️ This is a psychiatric emergency. You have a plan — you need immediate professional help.\n\nPlease call **988** right now, or go to your nearest emergency room and tell them you have a suicide plan. If you have a therapist or psychiatrist, call them now.\n\nThis moment is survivable. Please make the call."
  },
  {
    keywords: ["survived attempt", "attempted suicide", "tried to kill myself", "hospital after attempt"],
    response: "⚠️ You survived — and that matters. Even if you can't feel hope right now, the fact that you're here means there's still a possibility for things to change.\n\nThe period after a suicide attempt is highest risk. Please reach out to **988** or return to emergency care. You need and deserve professional support to stabilize.\n\nYour future self can feel very different from how you feel right now. Please let someone help you get there."
  },
  {
    keywords: ["suicidal thoughts no plan", "passive suicidal thoughts", "wish i was dead", "wish i could disappear"],
    response: "Passive suicidal thoughts — wishing to die without a plan — still deserve real attention and care.\n\nPlease reach out to **988** to talk with someone. Many people have these thoughts and go on to recover and build lives they didn't expect were possible.\n\nCan you identify one small reason to stay present today? A pet, a person, a question about tomorrow? Hold onto it. And please seek professional support this week — you don't have to carry this alone."
  },
  {
    keywords: ["support someone suicidal", "friend is suicidal", "loved one suicidal", "how to help someone suicidal"],
    response: "If someone you know is suicidal:\n• Stay with them if possible — physical presence matters.\n• Ask directly: 'Are you thinking about suicide?' Asking doesn't plant the idea — it opens the door.\n• Help them call **988** or go to the emergency room.\n• Remove access to lethal means if you can (firearms, large quantities of medication).\n• Don't leave them alone until professional help arrives.\n\nYour concern is already an act of love. Trust your instincts."
  },
  {
    keywords: ["suicide survivor loss", "lost someone to suicide", "grief after suicide", "my friend died by suicide"],
    response: "I'm so deeply sorry for your loss. Grief after suicide is complex and often carries guilt, anger, confusion, and profound sadness — sometimes all at once.\n\nThis was not your fault. You could not have known, and even if you saw signs, you are not responsible for another person's choice.\n\nSupport specifically for suicide loss survivors: **AFSP.org**, LOSS groups (Loving Outreach to Survivors of Suicide). Please consider grief counseling — this particular grief benefits greatly from specialized support.\n\nYou are not alone."
  },

  // ==================== SHAME & GUILT ============================
  {
    keywords: ["shame", "i'm ashamed", "feel ashamed", "so much shame", "disgusted with myself"],
    response: "Shame is one of the most painful emotions — it whispers that you're not just someone who did something wrong, but that you *are* wrong, fundamentally flawed.\n\nBut research (especially Brené Brown's work) shows that shame is healed through connection, not isolation. The things we're most ashamed of are often the things that make us most human.\n\nYou don't have to earn your way back to feeling okay. What's the shame attached to? Sometimes saying it out loud to a safe person takes away enormous power."
  },
  {
    keywords: ["guilt", "feel guilty", "can't forgive myself", "i did something terrible", "my fault"],
    response: "Guilt, when it's proportionate, is a signal from your conscience — it shows you care about doing right. But guilt that spirals and won't let you move forward becomes self-punishment that helps no one.\n\n**Healthy guilt process**: Acknowledge the harm. Make amends where possible. Commit to doing differently. Then — release. You cannot undo the past, but you can choose who you are going forward.\n\nIf self-forgiveness feels impossible, a therapist can help you process this in a way that's healthy rather than punishing. What happened, if you're comfortable sharing?"
  },
  {
    keywords: ["embarrassed", "humiliated", "so embarrassed", "can't face anyone", "mortified"],
    response: "Acute embarrassment can feel physically unbearable — like everyone is watching and judging. But research consistently shows that we overestimate how much others notice and remember our awkward moments.\n\nThe 'spotlight effect' is real: you are the main character in your own story, but a minor character in everyone else's. People are far less focused on you than you fear.\n\nWith time, most moments that feel devastating become stories we can even laugh about. Is this a specific incident that's been replaying?"
  },

  // ==================== RELATIONSHIPS & FAMILY ===================
  {
    keywords: ["relationship problems", "marriage problems", "couples conflict", "relationship communication", "partner issues"],
    response: "Relationship distress is common, painful, and — importantly — very often treatable.\n\n**Communication skill to start with**: Use 'I feel...' statements instead of 'You always...' For example: 'I feel unheard when our conversations get cut short' instead of 'You never listen.'\n\nCouples therapy (especially Gottman Method or EFT) is highly effective when both people are willing. Most couples wait too long — the earlier you seek help, the easier the path. What's the core pattern you keep getting stuck in?"
  },
  {
    keywords: ["breakup", "divorce", "relationship ending", "heartbreak", "we broke up", "she left", "he left"],
    response: "Breakup grief is real — your brain processes it as a literal loss, with the same neural pathways as physical pain. What you're feeling makes complete sense.\n\n**What tends to help**:\n• Allow yourself to grieve — don't rush it.\n• No contact (at least 30 days) helps the brain detach.\n• Reconnect with your pre-relationship self — the hobbies, friendships, and parts of you that existed before.\n• Journal what you learned about yourself and what you need.\n\nYou will love again. But first, heal. What's the hardest part right now?"
  },
  {
    keywords: ["family stress", "family conflict", "toxic family", "difficult parents", "family issues"],
    response: "Family relationships carry our deepest wounds — because the people we most needed to feel safe with are the ones who hurt us, often without realizing it.\n\n**Healthy options depending on severity**:\n• Set specific, enforceable boundaries (not ultimatums — actual limits on what you will and won't accept).\n• Limit or regulate contact if it's genuinely harmful.\n• Seek family therapy if there's willingness on both sides.\n• Individual therapy to process the impact on you.\n\nYou get to define what 'family' means for your adult life. What's the specific dynamic that's most difficult?"
  },
  {
    keywords: ["parent stress", "parenting stress", "overwhelmed as parent", "struggling as parent", "bad parent"],
    response: "Parenting is one of the most demanding roles that exists — and the fact that you're worried about being a good parent suggests you care deeply. Uncaring parents don't usually worry about this.\n\n**Some reality checks**:\n• 'Good enough' parenting (not perfect) is what children need.\n• You cannot pour from an empty cup — taking care of yourself is not selfish, it's necessary.\n• Parental guilt is nearly universal and often disproportionate.\n\nIf you're feeling truly overwhelmed, support is available: parenting groups, parent-focused therapy, or postpartum support if this is new. What's the hardest part right now?"
  },
  {
    keywords: ["loneliness", "lonely", "alone", "no friends", "social isolation", "no one cares", "no one understands"],
    response: "Loneliness activates the same brain regions as physical pain — it's not weakness, it's your brain signaling an unmet need for connection.\n\n**Practical steps**:\n• Join something with regular scheduled contact (weekly class, volunteer group, club) — repeated unplanned interaction is how adult friendships form.\n• Reach out to one person from your past — a simple 'Hey, I was thinking about you' has a surprisingly high response rate.\n• Consider online communities around your genuine interests — these create real connections.\n\nTherapy can also address any social anxiety or past experiences making connection feel dangerous. What's been getting in the way of connection for you?"
  },
  {
    keywords: ["codependency", "people pleasing", "enabling others", "no boundaries", "can't say no", "always put others first"],
    response: "Codependency — focusing so much on others' needs that your own disappear — often develops as a survival strategy in difficult early environments. It made sense then. Now it costs you.\n\n**Starting points for change**:\n• Daily check-in: 'What do *I* need right now?' (not 'what does everyone around me need?')\n• Practice saying no in small, low-stakes situations.\n• Notice the difference between helping from love vs. helping from fear.\n\nCODA (Codependents Anonymous, free meetings) and therapy are both effective. The book 'Codependent No More' by Melody Beattie is a classic starting point."
  },

  // ==================== THERAPY & PROFESSIONAL HELP (8 responses) ====================
  {
    keywords: ["cbt", "cognitive behavioral therapy", "how does cbt work", "cbt techniques"],
    response: "CBT (Cognitive Behavioral Therapy) is the most extensively researched therapy for anxiety and depression. It works by identifying and changing unhelpful thought patterns and the behaviors that maintain distress.\n\n**Core technique — thought record**:\n1. Write the situation.\n2. Write your automatic thought.\n3. Write evidence for and against it.\n4. Write a balanced alternative thought.\n\nDone consistently, this rewires neural pathways over 8–20 sessions. Psychology Today's therapist finder lets you filter for CBT specialists. Would you like to know more about how it applies to your specific concerns?"
  },
  {
    keywords: ["dbt", "dialectical behavior therapy", "emotion regulation skills", "distress tolerance"],
    response: "DBT (Dialectical Behavior Therapy) was developed for people who experience emotions intensely. Its four skill modules:\n\n• **Mindfulness** — observe without judgment\n• **Distress tolerance** — survive crisis without making it worse\n• **Emotion regulation** — reduce intensity and reactivity\n• **Interpersonal effectiveness** — navigate relationships skillfully\n\nDBT skills groups are often more effective than individual DBT alone. Marsha Linehan's workbook is excellent for self-study. Who does DBT help most? People who feel emotions very intensely, struggle with self-harm, have unstable relationships, or feel chronically empty."
  },
  {
    keywords: ["emdr", "trauma therapy", "eye movement desensitization", "ptsd treatment"],
    response: "EMDR (Eye Movement Desensitization and Reprocessing) is one of the most effective treatments for PTSD and trauma.\n\nDuring EMDR, you briefly focus on a traumatic memory while the therapist guides bilateral stimulation (eye movements, taps, or tones). This helps your brain reprocess 'stuck' memories — moving them from raw, emotionally overwhelming to integrated, manageable narrative.\n\nMany people see significant improvement in 8–12 sessions. Look for certified EMDR therapists at **EMDRIA.org**. It's not re-traumatizing — it's done at your pace with a skilled guide."
  },
  {
    keywords: ["finding therapist", "therapist search", "how to find therapist", "can't find therapist", "looking for therapist"],
    response: "Finding a therapist can feel overwhelming — here's a clear guide:\n\n• **Psychology Today** (psychologytoday.com) — filter by insurance, specialty, gender, modality\n• **Open Path Collective** — $40–70 per session for people in financial need\n• **Community mental health centers** — sliding scale, often $10–30\n• **University training clinics** — supervised graduate students, very low cost\n• **Your EAP (Employee Assistance Program)** — many employers offer 6–10 free sessions\n\nDon't give up if the first therapist isn't right — fit matters enormously. What kind of support are you looking for?"
  },
  {
    keywords: ["online therapy", "therapy online", "betterhelp", "talkspace", "virtual therapy", "telehealth therapy"],
    response: "Online therapy is as effective as in-person for depression and anxiety — and often more accessible.\n\n**Options**:\n• **BetterHelp** (~$65–90/week): text, phone, or video with a licensed therapist\n• **Talkspace**: similar model, often insurance-covered\n• **Many local therapists** now offer telehealth via secure video platforms\n\nCheck your insurance provider directory — telehealth is often fully covered. The convenience removes many barriers (transportation, scheduling, anxiety about entering an office). It's a legitimate and effective option."
  },
  {
    keywords: ["therapy cost", "can't afford therapy", "afford therapy", "therapy too expensive", "low cost therapy", "free therapy"],
    response: "Cost should not stop you from getting support. Genuinely low-cost options:\n\n• **Open Path Collective**: $40–70/session (one-time $65 membership)\n• **Community Mental Health Centers**: federally funded, sliding scale, often $0–30\n• **University training clinics**: $10–20/session\n• **NAMI support groups**: completely free\n• **Your EAP**: up to 6–10 free sessions (check with HR)\n• **Ask any therapist directly**: 'Do you have sliding scale slots?' Many do.\n\nDon't rule out therapy without exploring these. Where are you located? (General region helps point to local resources.)"
  },
  {
    keywords: ["psychiatrist", "psychiatry", "medication management", "psychiatric evaluation", "need medication"],
    response: "Psychiatrists are medical doctors who specialize in mental health and can prescribe medication. Psychiatric nurse practitioners (PMHNPs) also prescribe and often have shorter wait times.\n\n**How to find one**:\n• Check your insurance provider directory and filter for psychiatry\n• Ask your primary care doctor for a referral\n• Telehealth psychiatry platforms (Talkiatry, Done, Cerebral) often have faster access\n\nIf you think medication might help, a psychiatrist's evaluation can clarify whether it's appropriate and which type to try first. What concerns have been making you consider this?"
  },
  {
    keywords: ["group therapy", "support groups", "peer support", "not alone", "others like me"],
    response: "Group therapy and peer support can be surprisingly powerful — often more so than people expect.\n\n**Benefits**: You discover you're not alone. You gain perspective from others' experiences. You practice social skills in a safe environment. It's typically lower cost.\n\n**Types**:\n• Process groups (sharing experiences)\n• Skills-based groups (CBT, DBT)\n• Condition-specific (depression, anxiety, trauma, grief)\n\nNAMI offers free support groups nationally. **NAMI.org** or call 1-800-950-NAMI. Psychology Today's group finder has listings by location. Would a specific type of group be helpful for what you're going through?"
  },

  // ==================== SELF-ESTEEM & IDENTITY ==================
  {
    keywords: ["low self esteem", "don't like myself", "hate myself", "self confidence", "self worth issues"],
    response: "Low self-esteem often has deep roots — critical messages absorbed in childhood, painful experiences, or chronic comparison to others. But it is not fixed.\n\n**Daily practices that build self-esteem**:\n• **Evidence log**: Each day, write 1–2 things you handled — not achievements, just things you did. Over time, this counters the inner critic.\n• **Self-compassion**: Speak to yourself as you'd speak to a friend who came to you with the same struggles.\n• **Limit comparison** — especially social media, which shows highlight reels, not reality.\n\nCBT and self-compassion-based therapy are both effective. What does the inner critical voice say most often?"
  },
  {
    keywords: ["identity crisis", "don't know who i am", "lost my identity", "who am i", "no sense of self"],
    response: "An identity crisis often happens at transition points — after a major loss, relationship ending, career change, or any event that removed a defining role.\n\nACT therapy (Acceptance and Commitment Therapy) is especially helpful here — it focuses on values rather than identity labels, and what you want to *do* in the world rather than who you need to *be*.\n\n**Start here**: What do you care about, even when you feel empty? What made you angry or moved you recently? Your values are the deepest part of you that doesn't change with circumstances."
  },

  // ==================== BODY IMAGE & EATING ======================
  {
    keywords: ["body image", "hate my body", "don't like how i look", "body shame", "feel ugly"],
    response: "Body dissatisfaction is incredibly common — and largely fueled by unrealistic, heavily edited media images that don't reflect reality.\n\n**Shifting the relationship with your body**:\n• **Function over form**: What can your body *do* rather than how does it *look*?\n• **Media diet**: Curate what you consume. Follow accounts that show diverse, real bodies.\n• **Movement for how it feels, not how it shapes** — exercise for energy and mood, not punishment.\n\nIf body image is significantly affecting your life, a therapist specializing in body image (HAES — Health at Every Size approach) can help. What aspect of your body feels most difficult to accept right now?"
  },
  {
    keywords: ["anorexia", "restricting food", "not eating", "fear of weight gain", "eating very little"],
    response: "⚠️ Anorexia nervosa is a serious medical and mental health condition with the highest mortality rate of any psychiatric disorder. This deserves immediate professional attention.\n\nRisks include: electrolyte imbalances, cardiac complications, bone density loss, organ damage. Recovery requires a team: medical monitoring, nutrition counseling, and therapy (FBT for adolescents, CBT for adults).\n\n**NEDA Helpline**: 1-800-931-2237. You deserve treatment — this isn't about willpower, it's an illness that responds to proper care."
  },
  {
    keywords: ["bulimia", "binge purge", "purging", "vomiting after eating", "laxative abuse"],
    response: "Bulimia is serious and carries real health risks — electrolyte imbalances (which can cause cardiac arrest), esophageal damage, dental erosion.\n\nRecovery is possible with: CBT (the most evidence-based therapy for bulimia), nutritional rehabilitation, and in some cases medication (fluoxetine is FDA-approved for bulimia).\n\n**NEDA Helpline**: 1-800-931-2237. The binge-purge cycle feels unbreakable from inside it, but many people have broken free with the right support. You're not alone in this."
  },
  {
    keywords: ["binge eating", "compulsive eating", "eating out of control", "binge episodes", "emotional eating", "eat when stressed"],
    response: "Emotional eating and binge eating are your nervous system's way of seeking regulation — food becomes a coping strategy when other tools aren't available.\n\n**First steps**:\n• Eat regular, adequate meals — restriction almost always precedes binges.\n• Identify the emotion *before* the binge: boredom, anxiety, loneliness, numbness?\n• Practice the 10-minute pause: when the urge hits, wait 10 minutes and check in with what you're actually feeling.\n\nTherapy (CBT or DBT) is highly effective. You don't need to earn help — all levels of struggle deserve support."
  },

  // ==================== TRAUMA & PTSD (6 responses) ====================
  {
    keywords: ["ptsd", "post traumatic stress", "trauma response", "flashbacks", "hypervigilance"],
    response: "PTSD involves four clusters: intrusive symptoms (flashbacks, nightmares, triggers), avoidance, negative mood/thinking, and hyperarousal (startle, hypervigilance, sleep disruption).\n\nEffective treatments: **EMDR**, **Prolonged Exposure (PE)**, **Cognitive Processing Therapy (CPT)**, Somatic Experiencing, and medication (SSRIs — sertraline and paroxetine are FDA-approved for PTSD).\n\nNot all therapists are trained in trauma — look specifically for trauma-informed or trauma-specialized clinicians. Recovery is genuinely possible. Your reactions make complete sense given what you experienced."
  },
  {
    keywords: ["complex ptsd", "cptsd", "childhood trauma", "developmental trauma", "prolonged abuse"],
    response: "Complex PTSD develops from prolonged, repeated trauma — especially in childhood or in inescapable situations (abuse, captivity, domestic violence). The wound is different from single-event PTSD.\n\nSymptoms include classic PTSD *plus*: difficulty regulating emotions, deep negative self-concept ('I'm broken'), relationship difficulties, and sometimes dissociation.\n\nTreatment is longer-term and phase-based: stabilization → trauma processing → integration. Therapists specializing in CPTSD (somatic therapies, Internal Family Systems, EMDR) are best suited for this. You're not broken — you adapted. Now you can heal."
  },
  {
    keywords: ["grounding techniques", "flashback help", "dissociation help", "triggered right now", "spiraling now"],
    response: "**Grounding — do this right now**:\n\n• **5-4-3-2-1**: Name 5 things you see, 4 you can touch (feel the texture), 3 you hear, 2 you smell, 1 you taste.\n• **Temperature**: Hold ice, splash cold water on your face, or hold a warm cup.\n• **Say aloud**: 'I am safe right now. Today is [date]. I am at [place]. This is a memory, not reality.'\n• **Feel your feet on the floor** — press them down, notice the ground.\n\nYou can return to the here and now. These sensations are real. The threat is in the past. Are you safe right now?"
  },
  {
    keywords: ["sexual assault", "rape survivor", "sexual abuse survivor", "csa survivor", "sexual violence"],
    response: "⚠️ What happened to you was not your fault — at any age, in any circumstance, regardless of what you wore, where you were, or what you did before.\n\nHealing from sexual trauma is possible with the right support. **RAINN** (1-800-656-4673, RAINN.org) offers free, confidential support 24/7 and can connect you with trauma-specialized therapists.\n\nYou deserved protection. You deserved belief. You survived something terrible, and you deserve care — not shame."
  },
  {
    keywords: ["dissociation", "feeling unreal", "depersonalization", "derealization", "spacing out", "feel detached"],
    response: "Dissociation is your brain's protective response to overwhelming stress — it disconnects you from unbearable experience. This is adaptive, not crazy.\n\nDepersonalization (feeling outside yourself, unreal). Derealization (world feels dreamlike, flat, unreal). Grounding helps (see grounding techniques).\n\nIf this happens frequently, it's worth exploring with a trauma-informed therapist — dissociation is treatable and often reduces significantly with appropriate therapy. You're not losing your mind."
  },
  {
    keywords: ["betrayal trauma", "trust issues", "can't trust anyone", "been betrayed", "cheating"],
    response: "Betrayal trauma — especially by someone you trusted and depended on — damages your sense of safety and your ability to trust your own perceptions.\n\nHealing involves rebuilding slowly: learning what safe relationships feel like, trusting your gut when something feels off, and gradually extending trust based on consistent behavior over time.\n\nTherapy (especially relational, attachment-focused, or EMDR for betrayal trauma) helps process the wound. Your difficulty trusting is not a flaw — it's a rational response to being hurt. You can learn to trust selectively and wisely."
  },

  // ==================== GRIEF & LOSS (5 responses) ====================
  {
    keywords: ["grief", "lost loved one", "bereavement", "someone died", "mourning"],
    response: "Grief isn't linear — it moves in waves, sometimes crashing when you least expect it, sometimes quiet for stretches. There's no right way to do this.\n\nCommon experiences: shock, yearning, disorganization, anger, guilt, profound sadness — often cycling and revisiting. All of it is normal.\n\nAllow yourself to mourn. Talk about the person you've lost — keeping their memory alive is healthy, not prolonging grief. Be patient with 'trigger days' — anniversaries, holidays, songs.\n\nIf grief is significantly disrupting daily function after many months, grief-specialized therapy can help. Who have you lost?"
  },
  {
    keywords: ["anticipatory grief", "terminal illness", "losing someone slowly", "someone dying"],
    response: "Anticipatory grief — grieving before an actual loss — is exhausting and often unrecognized. You're living with loss before the loss.\n\nYou may feel guilt for grieving 'too early,' or for moments of wishing the suffering would end. These are normal, human responses — they don't mean you love the person less.\n\nHospice and palliative care organizations often offer bereavement support even before death. Use this time to say important things, if possible. Accept help. You're carrying a heavy weight."
  },
  {
    keywords: ["miscarriage grief", "pregnancy loss", "baby loss", "stillbirth", "infant loss"],
    response: "Pregnancy and infant loss is devastating — and often minimized by others who don't understand its depth. This was a real loss of a hoped-for future, and your grief is valid regardless of how far along you were.\n\nYou don't need to 'move on' quickly. You're allowed to name this loss, mourn fully, and seek support.\n\nResources: **Still Standing Magazine**, **March of Dimes pregnancy loss support**, **SHARE Pregnancy and Infant Loss Support** (nationalshare.org). Grief counseling specifically for pregnancy loss is available. I'm so sorry."
  },
  {
    keywords: ["pet loss", "lost my dog", "lost my cat", "my pet died", "grieving my pet"],
    response: "Pet loss grief is real, profound, and often dismissed by others — but you've lost a family member who offered unconditional love and was woven into your daily routine. This hurts.\n\nAllow yourself to grieve fully. Rituals help: a memorial, a photo album, a donation in their name. Give yourself time — the house feeling quiet is real.\n\nPet loss support groups exist (ASPCA, local humane societies often have resources). New pet when *you* feel ready — not as a replacement, but as new love.\n\nI'm so sorry for your loss. They mattered."
  },
  {
    keywords: ["complicated grief", "stuck in grief", "grief not getting better", "grief years later"],
    response: "Complicated Grief (now called Prolonged Grief Disorder) involves intense yearning, preoccupation with the deceased, identity disruption, and difficulty accepting the loss — continuing at high intensity well beyond expected timeframes.\n\nThis is a recognized condition, not weakness. It doesn't improve on its own the way typical grief does.\n\nComplicated Grief Treatment (CGT), developed by Dr. Katherine Shear, is specifically designed for this and works when general grief counseling hasn't. Medication may also help if depression is co-occurring. You don't have to stay stuck."
  },

  // ==================== ANGER & IRRITABILITY (5 responses) ====================
  {
    keywords: ["anger", "rage", "furious", "so angry", "resentment", "bitter", "filled with anger"],
    response: "Anger often protects something underneath — hurt, fear, injustice, helplessness. The anger is real, but it's usually pointing to something deeper.\n\n**Ask yourself**: What's underneath this anger? Betrayal? Powerlessness? Fear of loss?\n\nHealthy expression: vigorous physical activity, assertive communication ('I feel angry because...'), journaling. Unhealthy: verbal or physical aggression, substance use, suppression (which builds pressure).\n\nIf anger is damaging your relationships, therapy (especially DBT emotion regulation skills) can help you work with anger without being controlled by it."
  },
  {
    keywords: ["irritable", "snapping at everyone", "short temper", "grumpy all the time", "easily annoyed", "everyone annoys me"],
    response: "Chronic irritability is often a symptom, not a personality flaw — it can signal depression (especially in adults), anxiety, sleep deprivation, burnout, hormone changes, or medical conditions.\n\n**Check the basics first**: Sleep quality, caffeine intake, alcohol use, hunger levels. These have a dramatic effect on irritability threshold.\n\nIf it's been persistent for weeks, a doctor can rule out medical causes. A mental health professional can explore whether depression, anxiety, or burnout is the root. You don't have to stay this way."
  },
  {
    keywords: ["passive aggressive", "indirect anger", "sarcastic", "silent treatment", "avoiding conflict"],
    response: "Passive aggression usually develops when direct expression of anger wasn't safe — in childhood, in power-imbalanced relationships, or in environments where conflict was dangerous.\n\nThe long-term cost: it creates distance, erodes trust, and leaves your needs perpetually unmet.\n\n**Learning direct communication** takes practice: 'I'm frustrated because...' 'I need...' 'Can we talk about...?' Assertiveness training (often part of CBT) teaches this skill. You can express anger honestly without it being destructive."
  },
  {
    keywords: ["anger after trauma", "trauma anger", "angry about what happened", "rage about my past"],
    response: "Anger after trauma is natural and legitimate — you were wronged, and your anger honors that truth.\n\nBut when anger becomes the dominant emotion that blocks healing or damages current relationships, it's worth exploring with a therapist.\n\nCPT (Cognitive Processing Therapy) directly addresses trauma-related anger by examining 'stuck points' — beliefs about blame, safety, power, and justice that often drive it. Your anger is valid. You also deserve peace."
  },
  {
    keywords: ["anger outburst", "anger management", "losing control anger", "explosive anger", "anger problems"],
    response: "Recurrent explosive anger outbursts that feel out of proportion to the trigger are treatable — often through CBT for anger management, sometimes with medication support.\n\n**Immediate skills**:\n• **Time-out**: Remove yourself before escalation — not to avoid the conversation, but to return to it with a regulated nervous system.\n• **Physiological signal awareness**: Notice your early warning signs (clenching jaw, raising voice, heart rate) before full escalation.\n\nA therapist can help you understand the triggers beneath the anger and build a different response pattern."
  },

  // ==================== SELF-HARM (5 responses - CRITICAL) ====================
  {
    keywords: ["self harm", "cutting myself", "self injury", "hurting myself", "burning myself"],
    response: "⚠️ Self-harm is serious — you're hurting your body to cope with overwhelming emotion. This is survival coping, not weakness.\n\nBut self-harm often escalates and carries real physical risks. **Alternatives** that address the same need:\n• Ice cube on skin (intense sensation without injury)\n• Snapping a rubber band\n• Intense exercise (sprint, jumping jacks)\n• Call crisis line: **988**\n\nDBT therapy was specifically developed for self-harm and has strong evidence. You can learn other ways to tolerate overwhelming feelings. You deserve help."
  },
  {
    keywords: ["self harm urges", "urge to hurt myself", "want to cut", "fighting urge to self harm"],
    response: "The urge is real and it's intense — and it will pass. Urges peak and subside, usually within 20–40 minutes.\n\n**Ride the urge out**:\n• Name what emotion is driving it (overwhelm, emptiness, numbness, anger?)\n• Hold ice in your hand — intense sensation, no harm\n• Call or text **988**\n• Delay: 'I'll wait 10 minutes before deciding.' Then 10 more.\n\nEach time you ride out an urge without acting on it, you're building a new neural pathway. DBT (Dialectical Behavior Therapy) teaches these skills systematically. Have you ever had DBT?"
  },
  {
    keywords: ["severe self harm", "deep cut", "medical attention self harm", "serious self injury"],
    response: "⚠️ If you've cut deep — down to fat or muscle, gaping edges, heavy bleeding, or if you've hit a vein — please go to the emergency room now or call 911.\n\nIf you're lightheaded, dizzy, or the bleeding isn't stopping — this is a medical emergency.\n\nThe ER will treat you without judgment. After medical stabilization, they can connect you with crisis support. Self-harm depth doesn't measure your pain or your worth. You deserve medical care."
  },
  {
    keywords: ["self harm recovery", "stopped self harming", "recovery from cutting", "self harm free"],
    response: "Recovery from self-harm is real and possible — and the fact that you're working toward it says something important about your strength.\n\nRelapses don't erase progress. They're information: what triggered this? What was the emotion that felt unbearable? What skills could help next time?\n\nMaintain contact with a therapist through recovery — the hard parts are when having professional support matters most. You've built something — every self-harm-free day is proof of your capacity to cope differently."
  },
  {
    keywords: ["support someone self harming", "friend hurting themselves", "help someone who cuts"],
    response: "Supporting someone who self-harms is emotionally demanding. Some guidance:\n\n• **Stay calm** — panic or anger pushes them away.\n• **Listen without judgment**: 'I'm here for you. I'm not going anywhere.'\n• **Don't demand they stop** immediately — they're using it to cope and need replacement skills first.\n• **Encourage professional help** — DBT therapy specifically helps with self-harm.\n• **You can't be their only support** — this is too much for one person to hold alone.\n\nTake care of yourself too. Your compassion matters, but you also need support."
  },

  // ==================== STRESS & BURNOUT (6 responses) ====================
  {
    keywords: ["burnout", "work exhaustion", "emotional exhaustion", "depersonalization burnout", "no energy for work"],
    response: "Burnout is not just tiredness — it's a specific syndrome: emotional exhaustion, depersonalization (feeling detached or cynical), and reduced sense of accomplishment.\n\nIt's caused by chronic, unresolved workplace stress — and it's not solved by self-care weekends.\n\n**What actually helps**:\n• Genuine recovery time (real unplugging, not just a different kind of work)\n• Reducing workload — delegate, deprioritize, negotiate\n• Examining whether the environment itself is the problem (culture, management, values mismatch)\n\nBurnout recovery takes months. A therapist can help you process and restructure. You didn't fail — your system was overloaded."
  },
  {
    keywords: ["work stress", "job stress", "workplace stress", "toxic boss", "toxic workplace"],
    response: "Work stress is real and valid — and your mental health is worth more than any job.\n\n**First step**: Is this stress temporary (deadline) or chronic (environment)?\n\n**For temporary stress**: Prioritize ruthlessly, delegate, take micro-breaks every 90 minutes (5 minutes walking), protect your sleep.\n\n**For chronic/toxic stress**: Document what's happening, know your rights, use your EAP (free counseling), and if the environment is genuinely harmful — start exploring your options. No salary compensates for significant mental health damage."
  },
  {
    keywords: ["academic stress", "exam anxiety", "study stress", "school pressure", "university stress"],
    response: "Academic pressure can feel all-consuming — your worth feels tied to grades and performance, and the stakes feel enormous.\n\n**Practical strategies**:\n• Pomodoro method: 25 minutes focused work, 5-minute break — repeat.\n• Sleep before exams — all-nighters reliably reduce performance.\n• Perfectionism fuels stress: aim for 'good enough to pass' before aiming for 'best possible.'\n\nUse campus counseling services — they're usually free and understand academic pressures. Talk to professors early if you're struggling — most will work with you. Your worth is not your GPA."
  },
  {
    keywords: ["financial stress", "money problems", "debt anxiety", "money worries", "can't pay bills"],
    response: "Financial stress activates the same brain threat-response as physical danger — it's chronic, pervasive, and exhausting.\n\nThe mental health effects are real: higher rates of depression, anxiety, sleep problems, and relationship conflict.\n\n**Addressing both sides**:\n• **Practical**: Free financial counseling is available through NFCC.org (National Foundation for Credit Counseling). Many nonprofits offer free help with budgeting and debt.\n• **Emotional**: Acknowledge that the stress is legitimate. Avoid shame spirals — financial difficulty is a circumstance, not a character flaw.\n\nWhat's the most pressing financial stressor right now?"
  },
  {
    keywords: ["caregiver burnout", "caring for someone", "elder care stress", "looking after sick person"],
    response: "Caregiver burnout is serious and common — and caregivers are among the most underserved people in mental health.\n\nSigns: exhaustion, resentment, health deterioration, feeling trapped, neglecting your own needs.\n\n**Critical reminders**:\n• You cannot pour from an empty cup — your needs are not optional.\n• Respite care (even a few hours) is not abandonment.\n• Caregiver support groups exist specifically for this experience.\n\nRespite care resources vary by region — your local Area Agency on Aging is a good starting point. Your wellbeing matters as much as the person you're caring for."
  },
  {
    keywords: ["stress management", "reduce stress", "coping with stress", "stress relief"],
    response: "Evidence-based stress reduction — the approaches with actual research behind them:\n\n• **Breathwork**: 4-7-8 breathing (inhale 4, hold 7, exhale 8) or the physiological sigh (double inhale through nose, long exhale through mouth)\n• **Mindfulness**: Even 5 minutes of focused breath attention reduces cortisol. Apps: Headspace, Insight Timer (free)\n• **Exercise**: 20 minutes of anything you'll actually do\n• **Social connection**: One genuine conversation per day\n• **Nature**: 20 minutes outside lowers cortisol measurably\n\nStart with one. Tiny changes compound over weeks. What's the biggest stressor right now?"
  },

  // ==================== MEDICATION (6 responses) ====================
  {
    keywords: ["antidepressant", "ssri", "prozac", "zoloft", "lexapro", "celexa", "paxil", "sertraline", "escitalopram"],
    response: "SSRIs (Selective Serotonin Reuptake Inhibitors) are the most commonly prescribed antidepressants: fluoxetine (Prozac), sertraline (Zoloft), escitalopram (Lexapro), citalopram (Celexa), paroxetine (Paxil).\n\n**Key facts**:\n• Take 4–6 weeks to reach full effect — don't give up early.\n• Side effects are often temporary (first 1–2 weeks).\n• Never stop suddenly — taper with your doctor's guidance.\n• Effectiveness varies individually — the first one tried isn't always the right one.\n\nOnly a psychiatrist or doctor can prescribe. What questions do you have about antidepressants?"
  },
  {
    keywords: ["snri", "venlafaxine", "effexor", "duloxetine", "cymbalta", "pristiq"],
    response: "SNRIs (Serotonin-Norepinephrine Reuptake Inhibitors) affect both serotonin and norepinephrine: venlafaxine (Effexor XR), duloxetine (Cymbalta), desvenlafaxine (Pristiq).\n\nOften prescribed when SSRIs are insufficient, or for anxiety alongside depression, or for chronic pain conditions (Cymbalta has FDA approval for several pain conditions).\n\n**Important**: SNRIs — especially venlafaxine — can have intense discontinuation symptoms. Always taper slowly under medical supervision. Don't stop abruptly."
  },
  {
    keywords: ["wellbutrin", "bupropion", "atypical antidepressant", "ndri"],
    response: "Bupropion (Wellbutrin) works differently — it affects dopamine and norepinephrine, not serotonin.\n\n**Advantages**: No sexual side effects (unlike SSRIs), may help with energy and focus, weight-neutral or sometimes weight-reducing, also used for smoking cessation.\n\n**Cautions**: Can increase anxiety in some people, lowers seizure threshold (avoid with active seizure disorder or eating disorders with purging).\n\nOften added to SSRIs to address sexual side effects or persistent fatigue. Ask your prescriber if it might fit your specific situation."
  },
  {
    keywords: ["medication side effects", "antidepressant side effects", "ssri side effects", "my medication is making me"],
    response: "Common antidepressant side effects (most temporary, resolving in 1–2 weeks): nausea, headache, drowsiness or insomnia, dry mouth, sweating.\n\n**Sexual side effects**: Often don't improve on their own. Options: add bupropion, switch medication, or add buspirone. Don't suffer silently — tell your prescriber.\n\n**Never stop suddenly**: Withdrawal causes flu-like symptoms, brain zaps, mood swings, dizziness. Always taper slowly with your doctor's guidance.\n\nIf a side effect feels severe or unusual, contact your prescribing doctor promptly."
  },
  {
    keywords: ["antidepressant withdrawal", "stopping antidepressants", "tapering medication", "discontinuation syndrome"],
    response: "Antidepressant discontinuation syndrome is real and often underestimated — especially with SSRIs and SNRIs (except fluoxetine, which has a long half-life that makes it self-tapering).\n\nSymptoms: brain zaps (electric shock sensations), dizziness, nausea, irritability, flu-like symptoms, vivid dreams, sensory disturbances.\n\n**Prevention**: Slow taper — reduce by 10% of current dose every 2–4 weeks. Slower is better, especially for longer-term users. Work with your prescribing doctor. The Ashton Manual is a patient resource for tapering benzodiazepines specifically."
  },
  {
    keywords: ["medication not working", "antidepressant not working", "nothing works for me", "tried everything"],
    response: "About 30% of people don't fully respond to the first antidepressant tried — so 'not working' is information, not failure.\n\n**Next steps**:\n1. Increase dose (if within therapeutic range)\n2. Switch within or between classes (SSRI → SNRI → atypical)\n3. Augment (add bupropion, aripiprazole, lithium)\n4. TMS (Transcranial Magnetic Stimulation) — non-invasive brain stimulation\n5. Ketamine/esketamine (Spravato) — rapid-acting for treatment-resistant depression\n6. ECT for severe, refractory cases\n\nAsk your psychiatrist specifically: 'What's the next step in a treatment algorithm for my situation?' You haven't tried everything."
  },

  // ==================== WELLNESS & SELF-CARE ====================
  {
    keywords: ["self care", "taking care of myself", "wellness", "mental health habits", "routine"],
    response: "Real self-care isn't luxurious extras — it's the non-negotiable daily foundations that keep you stable:\n\n**Core pillars**:\n• **Sleep**: 7–9 hours, consistent schedule\n• **Nutrition**: Regular meals, protein, complex carbs, hydration\n• **Movement**: 20+ minutes of anything you'll do\n• **Sunlight**: Morning exposure\n• **Connection**: One genuine interaction daily\n• **Medication** (if prescribed): non-negotiable\n\nStart with the one that's most degraded right now. Don't try to overhaul everything. Small consistent changes compound into real wellbeing over weeks."
  },
  {
    keywords: ["meditation", "mindfulness", "mindfulness practice", "breathing exercises", "calm my mind"],
    response: "Mindfulness has genuine research support: reduces anxiety, depression, and stress; improves emotion regulation, focus, and relationships.\n\n**Starting point**: Just 2 minutes. Focus on breath. Mind wanders — that's normal and expected. Notice it wandered (without judgment) and return to breath. That noticing *is* the practice.\n\n**Apps**: Headspace (great for beginners), Calm, Insight Timer (free and extensive). Many excellent free guided sessions on YouTube.\n\n2 minutes daily beats 20 minutes occasionally. Consistency matters more than duration. How long have you been thinking about trying this?"
  },
  {
    keywords: ["exercise for mental health", "working out depression", "movement mood", "does exercise help"],
    response: "Exercise has genuinely strong evidence for mental health: it's as effective as antidepressant medication for mild-to-moderate depression in several studies.\n\n**Why it works**: Increases endorphins, BDNF (brain-derived growth factor that promotes new neural connections), regulates dopamine and serotonin, reduces cortisol and inflammation, provides accomplishment and routine.\n\n**Key insight**: Any movement you'll actually do. Start at 5 minutes. Walking counts completely. Don't make it punishment — find something you can tolerate or even slightly enjoy. What kind of movement have you done before that felt okay?"
  },
  {
    keywords: ["nature", "outside", "fresh air", "go for walk", "sunlight"],
    response: "Even brief nature exposure has measurable mental health benefits:\n\n• Reduces rumination (quiets the 'default mode network')\n• Lowers cortisol, blood pressure, and heart rate\n• Improves attention, mood, and immune function\n\n20 minutes in a green space (or even a city park) creates these effects. 'Forest bathing' (shinrin-yoku) — simply being present in nature without purpose — is the most potent form.\n\nMorning sunlight specifically helps regulate cortisol and improve sleep. Even cloudy outdoor light is far brighter than indoor lighting. Could you step outside for 20 minutes today?"
  },
  {
    keywords: ["gratitude", "gratitude journal", "gratitude practice", "positive thinking", "thankful"],
    response: "Gratitude interventions have solid research backing — they increase wellbeing, improve sleep, and reduce depression over time.\n\n**The most effective practice**: Each day, write 3 *specific* things you're grateful for — not 'my family' but 'my sister sent me a funny meme that made me laugh.' Specificity is what makes it work.\n\nWhy it helps: Trains your attention to scan for positives alongside problems — not bypassing reality, but balancing your threat detection system.\n\nTry for 14 days. Most people notice a shift. This isn't toxic positivity — you can be honest about hard things *and* notice small good things."
  },
  {
    keywords: ["journaling", "writing for mental health", "should i journal", "journal therapy"],
    response: "Journaling is one of the most accessible and evidence-supported mental health tools — and there are many forms:\n\n• **Expressive writing**: Write about your deepest thoughts and feelings without editing — research by James Pennebaker shows lasting benefit after just 3–4 sessions.\n• **Gratitude journal**: 3 specific things daily.\n• **Thought record**: Situation → automatic thought → evidence → balanced thought.\n• **Stream of consciousness**: Write without stopping for 10 minutes.\n\nNo rules: bad grammar welcome, no one reads it. The act of externalizing thoughts changes their power. Have you tried it before?"
  },

  // ==================== SUBSTANCE USE ==========================
  {
    keywords: ["alcohol problem", "drinking too much", "alcohol use disorder", "alcoholism", "can't stop drinking"],
    response: "Alcohol Use Disorder exists on a spectrum from mild to severe, and it's a medical condition, not a moral failure.\n\n**Signs**: Drinking more than intended, unable to cut down, withdrawal symptoms, tolerance increasing, craving, continued use despite clear harm.\n\n**Treatment options**: Medications (naltrexone, acamprosate, disulfiram), therapy (CBT, motivational interviewing), support groups (AA, SMART Recovery, Moderation Management).\n\nYou don't need to hit 'rock bottom.' The SAMHSA helpline can connect you with local resources: **1-800-662-4357**. Have you tried to cut back before?"
  },
  {
    keywords: ["weed addiction", "cannabis use disorder", "marijuana problem", "can't stop smoking weed", "too much weed"],
    response: "Cannabis Use Disorder is real — about 30% of regular users develop it. It's often minimized, but the struggle is genuine.\n\nSigns: using more than intended, unsuccessful attempts to cut down, withdrawal (irritability, sleep problems, appetite loss, anxiety), significant craving.\n\nTreatment: CBT, motivational enhancement therapy, contingency management. No FDA-approved medications yet, but therapy is effective. Marijuana Anonymous offers support groups.\n\nYou don't have to stop forever to acknowledge it's a problem right now. What's made cutting back difficult?"
  },
  {
    keywords: ["opioid addiction", "opioid use disorder", "painkiller addiction", "heroin use", "fentanyl"],
    response: "Opioid Use Disorder is deadly but highly treatable — and medication is the cornerstone of effective treatment.\n\n**Medications for Opioid Use Disorder (MOUD)**: Buprenorphine (Suboxone), methadone, or naltrexone (Vivitrol) reduce overdose risk by more than 50%.\n\nThis is not 'replacing one addiction with another' — it's standard medical treatment, like insulin for diabetes.\n\n**SAMHSA helpline**: 1-800-662-4357. **findtreatment.gov** locates local providers. You deserve treatment. Reaching out to a doctor or addiction specialist is the most important step."
  },

  // ==================== ADHD & NEURODIVERSITY ==================
  {
    keywords: ["adhd", "attention deficit", "can't focus", "executive dysfunction", "procrastination", "inattentive"],
    response: "ADHD in adults involves executive dysfunction — difficulty with task initiation, sustained attention, organization, time management, working memory, and emotion regulation. This is not laziness; your brain processes dopamine differently.\n\n**Strategies that help**:\n• External accountability (body doubling, telling someone what you'll do)\n• Break tasks into ridiculously small steps\n• Use timers (5 minutes of focus, then permission to stop)\n• Reduce initiation barriers (keep the guitar out, not in the case)\n\nDiagnosis and treatment (medication, coaching, CBT for ADHD) can be genuinely life-changing. Have you been evaluated?"
  },
  {
    keywords: ["autism", "autistic", "asd", "neurodivergent", "sensory sensitivity", "social difficulties"],
    response: "Autism is a neurological difference — not a defect — that affects how you experience the world: sensory input, social processing, communication, and the deep comfort of routine and special interests.\n\nMany autistic adults feel exhausted from 'masking' (performing neurotypicality) — and discovering you're autistic can be a profound relief, even as an adult.\n\nMental health support that respects your neurodivergence matters. Autistic adults often benefit from therapists who understand autism specifically (not trying to 'fix' you, but helping you live authentically).\n\nIs there something specific about your experience you'd like to talk through?"
  },
  {
    keywords: ["rejection sensitive dysphoria", "rsd", "intense emotional reactions", "sensitive to criticism"],
    response: "Rejection Sensitive Dysphoria (RSD) — intense, sometimes overwhelming emotional pain from real or perceived rejection or criticism — is especially common in ADHD and autism.\n\nYou might feel devastated by minor feedback, shut down, or become flooded with shame or rage. This is neurological, not dramatic or weak.\n\n**What helps**:\n• Naming it: 'This is RSD — it's my nervous system's response, not necessarily reality.'\n• Delay: Wait 24 hours before responding to perceived rejection.\n• Medication: Guanfacine and clonidine can specifically reduce RSD intensity.\n\nDo you have an ADHD diagnosis? RSD is often under-discussed even in treatment."
  },

  // ==================== EXISTENTIAL & PHILOSOPHICAL ============
  {
    keywords: ["meaning of life", "life is meaningless", "what's the point", "no purpose", "existential", "why am i here"],
    response: "Existential questioning — 'What's the point? Why am I here?' — often arrives during depression, major transitions, or grief. Sometimes it's philosophical curiosity; sometimes it's pain speaking.\n\n**If it's pain**: Please tell me more about what's going on — these questions often mean something important is struggling beneath them.\n\n**If it's philosophical**: Meaning isn't found — it's created. ACT therapy (Acceptance and Commitment Therapy) is built on this: rather than asking 'What is the meaning of life?', ask 'What do I want my life to mean?' Values are a compass when purpose isn't clear.\n\nWhat's prompting this for you right now?"
  },
  {
    keywords: ["spirituality mental health", "faith and mental health", "religious trauma", "lost my faith", "spiritual crisis"],
    response: "Spirituality and mental health are deeply interconnected for many people. For some, faith is a powerful source of resilience and community. For others, religious environments or experiences have caused real harm (religious trauma, shame, exclusion).\n\nBoth experiences are valid and real.\n\nReligious trauma is increasingly recognized as a distinct form of trauma — a spiritually-sensitive therapist (not necessarily religious themselves) can help you process it.\n\nIf spirituality is a resource for you, leaning into community and practices can significantly support mental health. What's your current relationship with spirituality like?"
  },
  {
    keywords: ["loneliness of life", "everyone dies alone", "life is hard", "life is suffering", "no one understands me"],
    response: "That sense of being fundamentally alone — even among people — is one of the most profound forms of suffering humans experience.\n\nAnd yet: connection is possible. Not the kind where someone perfectly understands you — that's rare. But the kind where you feel genuinely seen, even imperfectly, even briefly.\n\nTherapy often provides the first experience of this for people who've never had it — a space where you can be honest about your experience and feel received without judgment.\n\nI want to understand you better. What's the loneliness that most persists, even when you're around others?"
  },

  // ==================== SPECIFIC LIFE SITUATIONS ==============
  {
    keywords: ["new job stress", "starting new job", "job change anxiety", "new workplace"],
    response: "Starting something new is inherently stressful — your nervous system hasn't established safety yet. This is normal, and it typically reduces significantly after 4–8 weeks as you build familiarity.\n\n**In the meantime**:\n• Give yourself a longer adjustment timeline than you think you need.\n• Ask questions — most people respect someone who admits what they don't know.\n• Protect non-work recovery time (your brain is working hard).\n• Identify one trusted colleague to build relationship with first.\n\nWhat's the most anxiety-provoking part of this transition?"
  },
  {
    keywords: ["moving stress", "moving to new city", "relocating", "homesick", "miss home"],
    response: "Relocation grief is real — you've lost your social environment, your familiar places, your routines. Even if the move was positive, grief can coexist with excitement.\n\n**Building new roots takes time** — research suggests about 6 months before a new place starts feeling familiar.\n\nActively building community accelerates this: join one recurring activity (class, group, volunteer shift). Repeated contact with the same people is how friendships form.\n\nBeing homesick doesn't mean you made a mistake. It means you had something worth missing."
  },
  {
    keywords: ["social media mental health", "comparing myself online", "social media depression", "instagram anxiety"],
    response: "Social media significantly impacts mental health — particularly for people already vulnerable to depression, anxiety, or low self-esteem.\n\nYou're comparing your inner experience (your full reality, including struggles) to others' curated highlight reels. This comparison is structurally unfair and almost always distorts your perception.\n\n**Practical steps**:\n• Audit who you follow — unfollow anyone who consistently makes you feel worse.\n• Time limits (Screen Time on iOS, Digital Wellbeing on Android).\n• Notice how you feel before and after scrolling.\n\nThe effect is dose-dependent — less use typically correlates with better mood."
  },
  {
    keywords: ["forgiveness", "how to forgive", "can't forgive", "should i forgive"],
    response: "Forgiveness is one of the most misunderstood concepts in mental health.\n\n**What forgiveness is**: Releasing the resentment that keeps you imprisoned — for *your* sake, not for the person who hurt you.\n\n**What forgiveness is not**: Condoning what happened. Reconciling with the person. Pretending it didn't matter.\n\nYou can forgive someone and still maintain distance. You can forgive and still be angry about the injustice. You can forgive without ever telling them.\n\nForced forgiveness before you're ready isn't healing — it's suppression. Where are you in this process?"
  },
  {
    keywords: ["procrastination", "can't start", "keep putting things off", "avoidance"],
    response: "Procrastination isn't laziness — it's usually emotion regulation. You're avoiding the discomfort associated with the task: fear of failure, perfectionism, overwhelm, boredom.\n\n**Breaking through**:\n• **Make it ridiculously small**: 'Open the document' — that's the only goal.\n• **Time-box**: Work for 5 minutes, then you can stop. (You usually don't stop.)\n• **Self-compassion first**: Self-criticism makes procrastination worse, not better.\n• **Identify the real emotion**: What specifically feels bad about starting this task?\n\nFor ADHD-related procrastination specifically, external accountability (body doubling, commitment devices) is especially effective."
  },

  // ==================== CRISIS & EMERGENCY RESOURCES ===========
  {
    keywords: ["988", "suicide hotline", "crisis line", "national suicide prevention"],
    response: "**988** is the national Suicide and Crisis Lifeline in the US — call or text, available 24/7, free, and confidential.\n\n• Veterans: Press 1\n• LGBTQ+ youth: Press 3 or text 'PRIDE' to 988\n• Spanish line available\n• Online chat: 988lifeline.org/chat\n\nYou don't have to be actively suicidal to call 988 — they also help with overwhelming anxiety, depression, loneliness, or any mental health crisis. They're trained to listen without judgment."
  },
  {
    keywords: ["crisis text line", "text home", "741741", "text for help"],
    response: "**Crisis Text Line**: Text HOME to 741741 from anywhere in the US — 24/7, free, confidential.\n\nA trained crisis counselor (real human, not automated) will respond within minutes to listen and help you de-escalate. Text is especially helpful if you can't talk aloud — in public, at night, or when calling feels too hard.\n\nThey don't contact police unless you have an immediate plan with means and are unable to safety plan. Many people prefer text for the first conversation."
  },
  {
    keywords: ["trevor project", "lgbtq crisis", "lgbtq mental health", "lgbtq support"],
    response: "**The Trevor Project** provides crisis support specifically for LGBTQ+ youth (under 25):\n• Call: 1-866-488-7386\n• Text: START to 678-678\n• Chat: thetrevorproject.org\n• Available 24/7, free, confidential\n\nCounsors are trained specifically in LGBTQ+ experiences — coming out, family rejection, identity questions, discrimination.\n\nYou are valid. Your identity is real. And you deserve support from people who understand your specific experience."
  },
  {
    keywords: ["samhsa", "addiction hotline", "mental health helpline", "substance abuse hotline"],
    response: "**SAMHSA National Helpline**: 1-800-662-4357 (1-800-662-HELP)\nFree, confidential, 24/7. Available in English and Spanish.\n\nProvides information and referrals for mental health and substance use disorders — including finding local treatment, support groups, and community organizations.\n\nText your ZIP code to 898-211 to find local services. Also: **findtreatment.gov** to locate nearby treatment providers."
  },

  // ==================== GENERAL FALLBACK ======================
  {
    keywords: ["default", "catch all", "unknown query"],
    response: "Thank you for sharing that with me. I want to understand better so I can support you.\n\nCould you tell me more about what you're experiencing? Even if it feels messy or hard to put into words — that's completely okay. Sometimes saying things out loud helps us understand what we're actually feeling.\n\nWhat's been weighing on you most lately?"
  },
  {
    keywords: ["i don't know", "not sure what's wrong", "can't explain it", "don't know how to say it"],
    response: "That's okay — sometimes we don't have words for what's wrong, and that's a valid place to start.\n\nDo you feel it more in your body? Tension, heaviness, numbness, a kind of restlessness? Or is it more like a vague sense that something is off without a clear reason?\n\nEither way, what you're feeling is real even without labels. There's no pressure to get it 'right' — just talk, and we'll find our way through it together."
  },
  {
    keywords: ["rant", "venting", "need to vent", "just listen", "don't tell me what to do"],
    response: "I'm here. Say whatever you need to say — you don't need to be coherent, polite, or productive. Just get it out.\n\nI'll listen without interrupting, judging, or rushing to fix. When you're done, we can talk about what might help — or not, if you just needed to be heard.\n\nThat's okay too. Go ahead."
  }
];

// ─── Helper: find matching response ─────────────────────────────────────────

export function findResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  for (const item of mentalHealthResponses) {
    for (const keyword of item.keywords) {
      if (lowerMessage.includes(keyword)) {
        console.log(`[AI] Matched keyword: "${keyword}"`);
        return item.response;
      }
    }
  }

  console.log(`[AI] No keyword match, using fallback`);
  return "Thank you for sharing that with me. Can you tell me more about what you're experiencing? I'm here to listen and support you.";
}

// ─── matchKeywordResponse — used by ai-chat route ─────────────────────────

export function matchKeywordResponse(message: string): { response: string; category: string; isCrisis: boolean } | null {
  const lowerMessage = message.toLowerCase();

  const crisisKeywords = [
    "suicide", "kill myself", "end my life", "suicidal", "take my life",
    "want to die", "better off dead", "no reason to live", "life not worth living",
    "suicide method", "how to kill myself", "lethal means", "suicide plan", "have a plan to die",
    "self harm", "cutting myself", "self injury", "hurting myself", "burning myself",
    "severe self harm", "deep cut", "medical attention self harm",
    "survived attempt", "attempted suicide", "tried to kill myself",
  ];

  for (const item of mentalHealthResponses) {
    for (const keyword of item.keywords) {
      if (lowerMessage.includes(keyword)) {
        const isCrisis = crisisKeywords.some(k => lowerMessage.includes(k));
        return { response: item.response, category: keyword.toUpperCase(), isCrisis };
      }
    }
  }
  return null;
}

// ─── fallbackResponses — final fallback layer ───────────────────────────────

export const fallbackResponses: string[] = [
  "Thank you for opening up. Whatever you're going through, you don't have to navigate it alone. Could you share a little more — how long have you been feeling this way, and is there a specific situation driving it?",
  "I appreciate you being here. What you're feeling is valid, and reaching out is an important step. Can you tell me more about what's been happening lately?",
  "I'm here for you. Mental health is deeply personal, and I want to make sure I understand what you're going through. Feel free to share more — even the parts that are hard to put into words.",
  "That sounds like a lot to be carrying. I'm here to listen without judgment. Would you be willing to tell me a bit more about what's been going on?",
  "I hear you. Sometimes the hardest part is knowing where to start — but you don't have to have it figured out. Just share what's on your mind, and we'll go from there.",
];

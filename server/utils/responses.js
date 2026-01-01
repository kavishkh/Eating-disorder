const responses = {
    binge_urge: {
        low: [
            "I’m glad you shared this. Even small urges are worth acknowledging.",
            "It's okay to feel a bit of an urge; let's try to gently redirect your focus.",
            "You're in control. Let's take a slow breath together.",
            "I hear you. Distractions can be helpful when things feel a bit restless. Want to try one?",
            "Thanks for naming that feeling. Acknowledging it is the first step in staying in charge."
        ],
        medium: [
            "I’m really glad you told me. Urges can feel strong, but they do pass.",
            "Let’s slow this moment down together. Take one deep breath with me.",
            "This urge does not control you. You are still in charge.",
            "I know this feeling is uncomfortable, but you have survived 100% of your urges so far.",
            "Let's look at this urge like a wave—it peaks, but it always crashes back down."
        ],
        high: [
            "I hear how intense this is right now. Please know I am right here with you.",
            "Let's focus only on the next 10 seconds. Just breathe. You can get through these 10 seconds.",
            "The intensity of this feeling is high, but it is temporary. I'm sitting here with you until it eases.",
            "I am holding space for you right now. You don't have to act on this feeling to make it stop.",
            "Breathe with me. In for 4, hold for 4, out for 4. We do this until the heat fades."
        ]
    },

    guilt: {
        low: [
            "Feeling a bit of guilt is heavy, but remember you're doing your best.",
            "Try to be gentle with yourself; progress isn't always linear.",
            "It's okay to have complicated feelings today. You're allowed to be human.",
            "Guilt often tells us lies. I'm here to remind you that you are doing enough.",
            "Take a moment to acknowledge the guilt, then see if you can let it sit quietly while we talk."
        ],
        medium: [
            "Feeling guilty can be very heavy. You’re not a bad person.",
            "Slipping does not erase your progress.",
            "You deserve kindness, especially from yourself.",
            "I can hear the self-criticism. Would you say these things to a dear friend in your position?",
            "Guilt is a feeling, not a fact. You are still a person worthy of recovery and care."
        ],
        high: [
            "I can hear the weight of this guilt, and I want you to know it doesn't define you.",
            "You are worthy of forgiveness and grace, especially from yourself, in this very moment.",
            "Please try to release the pressure you're putting on yourself. You are human and you are recovering.",
            "This intensity is exhausting. Let's try to lower the volume of that inner critic for just a minute.",
            "I am here to tell you: You have not failed. You are simply in a difficult part of the journey."
        ]
    },

    sadness: {
        low: [
            "I’m really sorry you’re feeling this way. Thanks for telling me — having a not-so-good day can feel heavy.",
            "I’m really sorry today hasn’t been good for you. I’m glad you told me — you don’t have to carry it alone.",
            "It's okay to feel a bit down. Sometimes we just need to acknowledge the heaviness.",
            "I hear you. If today feels a bit gray, that's okay. I'm here to sit in the gray with you.",
            "Thanks for being honest about how you feel. Low energy days are part of the process."
        ],
        medium: [
            "I’m sorry you’re feeling this way. You’re not weak for feeling this.",
            "Some days are harder, and that’s okay.",
            "You don’t have to go through this alone.",
            "I can hear the sadness in your words. It's valid to feel this way after everything you've navigated.",
            "It's okay to slow down when things feel heavy. I'm right here with you."
        ],
        high: [
            "I hear how deep this sadness is. It sounds incredibly painful.",
            "I am sitting here with you. You don't have to carry this alone.",
            "It’s okay to not be okay right now. I'm here for as long as you need.",
            "The world might feel very dark right now, but I am holding a light for you.",
            "I'm so sorry it's this hard right now. You don't have to explain it—just know I'm listening."
        ]
    },

    anxiety: {
        low: [
            "It sounds like there's a bit of worry on your mind. Want to tell me more?",
            "Let's take a quick breath together to settle things.",
            "A little bit of anxiety can feel like a hum in the background. Does it feel like that?",
            "I hear the restlessness. You're doing well just by noticing it.",
            "It's okay to feel a bit on edge. I'm here to help you ground."
        ],
        medium: [
            "I hear how overwhelming this feels.",
            "Let’s ground ourselves—name one thing you can touch right now.",
            "You are safe in this moment.",
            "Anxiety can be so loud. Let's try to focus on the space around you for a second.",
            "I'm here. We can move at whatever pace feels safe for you."
        ],
        high: [
            "I can hear how loud the anxiety is right now. Let's focus on my voice/text.",
            "We are going to take this one second at a time. You are safe. I am here.",
            "Let's try a very slow grounding exercise. Can you feel your feet on the floor?",
            "I am right here. You are not going crazy, and you are not in danger. It's just a very strong feeling.",
            "Breathe with me. I'll stay right here until the shivering or the panic starts to fade."
        ]
    },

    anger: {
        low: [
            "It sounds like something is bothering you. It's okay to feel a bit frustrated.",
            "I'm here if you need to vent a little.",
            "Frustration is a natural response to struggle. I hear you.",
            "It's okay to feel a bit annoyed. Recovery can be very annoying sometimes!",
            "Thanks for sharing that. Anger is often just another way our brain tries to protect us."
        ],
        medium: [
            "I can see why this feels frustrating. Food struggles can trigger a lot of anger.",
            "It’s okay to feel angry. Let’s slow this moment down.",
            "I hear the fire in your words. It makes total sense that you'd feel this way.",
            "You're allowed to be mad at the situation. It's a lot to deal with.",
            "I'm here to listen to the anger. You don't have to keep it all inside."
        ],
        high: [
            "I hear the intensity of your anger, and I want you to know it's valid to feel this way.",
            "Let's try to let some of that heat out safely. Maybe a deep, loud exhale?",
            "I am here with you. Your anger doesn't scare me. We can sit with it together.",
            "It sounds like a storm in there right now. I'm here to be your anchor.",
            "I hear the outrage. It's okay to be this mad. Let's just make sure you're safe while you feel it."
        ]
    },

    neutral: [
        "I’m here with you. How are you feeling right now?",
        "What's on your mind? I'm listening.",
        "How has your day been so far?",
        "I'm just checking in. Is there anything you'd like to explore today?",
        "I'm here to support you in whatever way feels right today."
    ],

    crisis: [
        "I’m really sorry you’re feeling overwhelmed. You are not alone and there **is help available right now**.\n\nPlease reach out to one of these services in India:\n\n• **Tele-MANAS**: Dial **14416** or **1800-891-4416** — free 24x7 mental health support.\n• **KIRAN Helpline**: **1800-599-0019** — free toll-free emotional support.\n• **AASRA Suicide Prevention**: **+91-22-27546669** — confidential counselling.\n• **Vandrevala Foundation**: **+91-9999-666-555** — 24/7 crisis intervention.\n• **If you are in immediate danger, call 112 right now.**\n\nYou deserve help and support — please reach out to someone right away."
    ]
};

const foodResponses = {
    peas: [
        "It’s okay to dislike certain foods. You don’t have to force yourself.",
        "Would it help if peas were mixed with something you like, like rice or butter?",
        "You could start with just one bite — progress doesn’t mean perfection."
    ]
};

export { responses, foodResponses };

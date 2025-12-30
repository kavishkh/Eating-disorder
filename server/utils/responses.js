const responses = {
    binge_urge: {
        low: [
            "I’m glad you shared this. Even small urges are worth acknowledging.",
            "It's okay to feel a bit of an urge; let's try to gently redirect your focus.",
            "You're in control. Let's take a slow breath together."
        ],
        medium: [
            "I’m really glad you told me. Urges can feel strong, but they do pass.",
            "Let’s slow this moment down together. Take one deep breath with me.",
            "This urge does not control you. You are still in charge."
        ],
        high: [
            "I hear how intense this is right now. Please know I am right here with you.",
            "Let's focus only on the next 10 seconds. Just breathe. You can get through these 10 seconds.",
            "The intensity of this feeling is high, but it is temporary. I'm sitting here with you until it eases."
        ]
    },

    guilt: {
        low: [
            "Feeling a bit of guilt is heavy, but remember you're doing your best.",
            "Try to be gentle with yourself; progress isn't always linear."
        ],
        medium: [
            "Feeling guilty can be very heavy. You’re not a bad person.",
            "Slipping does not erase your progress.",
            "You deserve kindness, especially from yourself."
        ],
        high: [
            "I can hear the weight of this guilt, and I want you to know it doesn't define you.",
            "You are worthy of forgiveness and grace, especially from yourself, in this very moment.",
            "Please try to release the pressure you're putting on yourself. You are human and you are recovering."
        ]
    },

    sadness: {
        low: [
            "It's okay to feel a little down today. Some days are just quieter than others.",
            "I'm here to listen if you want to talk about it."
        ],
        medium: [
            "I’m sorry you’re feeling this way. You’re not weak for feeling this.",
            "Some days are harder, and that’s okay.",
            "You don’t have to go through this alone."
        ],
        high: [
            "I hear how deep this sadness is. It sounds incredibly painful.",
            "I am sitting here with you. You don't have to carry this alone.",
            "It’s okay to not be okay right now. I'm here for as long as you need."
        ]
    },

    anxiety: {
        low: [
            "It sounds like there's a bit of worry on your mind. Want to tell me more?",
            "Let's take a quick breath together to settle things."
        ],
        medium: [
            "I hear how overwhelming this feels.",
            "Let’s ground ourselves—name one thing you can touch right now.",
            "You are safe in this moment."
        ],
        high: [
            "I can hear how loud the anxiety is right now. Let's focus on my voice/text.",
            "We are going to take this one second at a time. You are safe. I am here.",
            "Let's try a very slow grounding exercise. Can you feel your feet on the floor?"
        ]
    },

    anger: {
        low: [
            "It sounds like something is bothering you. It's okay to feel a bit frustrated.",
            "I'm here if you need to vent a little."
        ],
        medium: [
            "I can see why this feels frustrating. Food struggles can trigger a lot of anger.",
            "It’s okay to feel angry. Let’s slow this moment down."
        ],
        high: [
            "I hear the intensity of your anger, and I want you to know it's valid to feel this way.",
            "Let's try to let some of that heat out safely. Maybe a deep, loud exhale?",
            "I am here with you. Your anger doesn't scare me. We can sit with it together."
        ]
    },

    neutral: [
        "I’m here with you. How are you feeling right now?",
        "What's on your mind? I'm listening.",
        "How has your day been so far?"
    ],

    crisis: [
        "I’m really concerned about you. You deserve immediate support and safety.",
        "It sounds like things are incredibly heavy right now. Please reach out to someone who can help you stay safe.",
        "You matter, and your safety is the most important thing right now. Please consider calling a crisis line."
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

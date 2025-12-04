/**
 * Fallback content for FOLKLORERUN game
 * Used when JSON files fail to load from creatures_game_data.json and ui_dynamic_config.json
 * This embedded content ensures the game remains functional even if external files are unavailable
 */

export const fallbackCreatureData = {
  creatures: [
    {
      id: "baba-yaga",
      name: "Baba Yaga",
      enrichedIntros: [
        "In a ring of birch, a hut breathes smoke and whispers. Chicken legs creak beneath warped wood. The witch waits, her mortar idle, her pestle gleaming. She offers riddles, not mercy.",
        "The forest parts. A hut stands on chicken legs, scratching at the earth. Baba Yaga peers from the window, her grin crooked and knowing. 'Come closer, traveler. Let's see if you're clever.'",
        "Bone-white birch trees circle the clearing. The hut spins slowly, its door facing you. Inside, the witch stirs her cauldron, humming riddles. Will you answer, or will you flee?"
      ],
      coreMechanic: "riddle",
      levels: [
        {
          levelIndex: 0,
          sceneText: "The witch's eyes gleam like amber coals.",
          enrichedScene: "Amber light spills from the window slats. Runes carved in bone dangle from the eaves, spinning slow. Baba Yaga leans forward, her grin sharp as winter. 'Answer me this, traveler.'",
          choices: [
            {
              text: "Speak the answer with cleverness",
              isCorrect: true,
              consequence: "She nods, impressed. 'Clever tongue. Pass, then.'"
            },
            {
              text: "Demand she let you pass",
              isCorrect: false,
              consequence: "The hut turns away. The forest swallows you whole."
            }
          ],
          riddleData: {
            riddle: "What walks on four legs at dawn, two at noon, and three at dusk?",
            hint: "Think of life's stages, from cradle to grave.",
            answerKey: "human"
          }
        },
        {
          levelIndex: 1,
          sceneText: "The witch circles you, her pestle tapping the ground.",
          enrichedScene: "Smoke curls from her pipe, thick and sweet. The hut's walls creak, listening. She taps her pestle once, twice. 'Another riddle, little mouse. Answer well.'",
          choices: [
            {
              text: "Answer with wisdom",
              isCorrect: true,
              consequence: "Her cackle echoes. 'Wise indeed. Proceed.'"
            },
            {
              text: "Refuse to answer",
              isCorrect: false,
              consequence: "She waves her hand. You become a frog, forever croaking."
            }
          ],
          riddleData: {
            riddle: "I have cities but no houses, forests but no trees, water but no fish. What am I?",
            hint: "You hold me to find your way.",
            answerKey: "map"
          }
        },
        {
          levelIndex: 2,
          sceneText: "The witch offers one final test.",
          enrichedScene: "The hut settles, its legs folding beneath. Baba Yaga's eyes soften, just a fraction. 'One last riddle, traveler. Answer true, and I grant you passage beyond the veil.'",
          choices: [
            {
              text: "Solve the final riddle",
              isCorrect: true,
              consequence: "She smiles, a rare gift. 'Go, blessed one.'"
            },
            {
              text: "Guess wildly",
              isCorrect: false,
              consequence: "The hut's door slams shut. You are lost to the woods."
            }
          ],
          riddleData: {
            riddle: "The more you take, the more you leave behind. What am I?",
            hint: "Every journey makes them.",
            answerKey: "footsteps"
          }
        }
      ],
      victoryTexts: [
        "The witch grants you passage. Her blessing burns warm in your chest, a gift of old magic.",
        "Baba Yaga cackles with delight. 'Clever one! Go forth with my favor.' The forest opens before you, welcoming.",
        "She nods, satisfied. 'You've earned your way, riddler.' Her magic settles on your shoulders like a cloak of stars."
      ],
      defeatTexts: [
        "The forest swallows your path. Baba Yaga's laughter echoes through the birch trees, fading into mist.",
        "The hut turns its back. You stumble through endless woods, lost forever. The witch's cackle follows you into darkness.",
        "She waves her pestle. The world tilts. You are something small now, scurrying through the underbrush, forgotten."
      ]
    },
    {
      id: "banshee",
      name: "Banshee",
      enrichedIntros: [
        "A keening cry splits the mist. She appears, pale as moonlight, her hair flowing like water. The Banshee mourns, and her sorrow drowns the living. Speak softly, or be lost to her wail.",
        "The mist thickens. A voice rises, elegiac and ancient. She drifts toward you, translucent and grieving. The Banshee remembers all who are forgotten. Will you listen to her lament?",
        "Cold wind carries her song. The Banshee materializes, eyes hollow with centuries of loss. Her sorrow is a tide that pulls the living under. Tread carefully, speak gently."
      ],
      coreMechanic: "calmness",
      levels: [
        {
          levelIndex: 0,
          sceneText: "The Banshee's eyes are hollow, filled with ancient grief.",
          enrichedScene: "Pale blue mist coils around her form. Her voice rises and falls like waves against stone. She reaches toward you, fingers trembling. 'Do you hear them? The voices of the lost?'",
          choices: [
            {
              text: "Speak gently of remembrance",
              isCorrect: true,
              consequence: "Her wail softens. A tear falls, luminous and cold."
            },
            {
              text: "Tell her to be silent",
              isCorrect: false,
              consequence: "Her scream shatters your mind. You fall, never to rise."
            }
          ]
        },
        {
          levelIndex: 1,
          sceneText: "The Banshee drifts closer, her sorrow palpable.",
          enrichedScene: "Echo-waves ripple from her form, each one carrying fragments of memory. She sings of loss, of names forgotten. The air grows cold. 'Will you remember me?' she whispers.",
          choices: [
            {
              text: "Promise to remember her name",
              isCorrect: true,
              consequence: "She smiles, faint as starlight. 'Thank you, kind soul.'"
            },
            {
              text: "Turn away from her",
              isCorrect: false,
              consequence: "Her wail pierces your heart. You join the forgotten."
            }
          ]
        },
        {
          levelIndex: 2,
          sceneText: "The Banshee's form begins to fade.",
          enrichedScene: "The mist thins. Her voice grows distant, elegiac and soft. She looks at you with eyes like deep water. 'One last question, traveler. Will you carry my song?'",
          choices: [
            {
              text: "Accept her song with reverence",
              isCorrect: true,
              consequence: "She fades, peaceful at last. Her song lives in you."
            },
            {
              text: "Refuse her burden",
              isCorrect: false,
              consequence: "She screams, and the world goes dark. You are lost."
            }
          ]
        }
      ],
      victoryTexts: [
        "The Banshee fades into mist, her sorrow eased. You carry her song, a haunting melody of remembrance.",
        "She smiles, a ghost of warmth. 'You have given me peace.' Her form dissolves, leaving only echoes of gratitude.",
        "The wail softens to a lullaby. She fades, finally at rest. Her memory lives in you, gentle and eternal."
      ],
      defeatTexts: [
        "Her wail consumes you. You become another voice in her eternal chorus, lost to the mist forever.",
        "The scream pierces your soul. You fall, joining the forgotten. The Banshee's sorrow claims another, endlessly mourning.",
        "Her cry shatters you. The mist closes in. You are lost now, a name she will sing in her endless lament."
      ]
    },
    {
      id: "aswang",
      name: "Aswang",
      enrichedIntros: [
        "In the village, lanterns flicker and die. Something moves in the shadows, wearing a familiar face. The Aswang hunts, patient and hungry. Watch closely. Trust nothing.",
        "Night falls on the village. Dogs bark warnings. A neighbor waves from the darkness, but their shadow falls wrong. The Aswang is here. Stay sharp, stay alive.",
        "The village sleeps uneasily. Lantern flames gutter and die. Something prowls between the houses, wearing stolen skin. The Aswang is hunting. Will you survive until dawn?"
      ],
      coreMechanic: "deduction",
      levels: [
        {
          levelIndex: 0,
          sceneText: "A neighbor approaches, smiling too wide.",
          enrichedScene: "Red-tinted fog creeps through the village streets. Lantern light flickers, casting long shadows. The neighbor's eyes catch the light strangely. 'Come closer,' they say. 'I have something to show you.'",
          choices: [
            {
              text: "Check for the telltale signs",
              isCorrect: true,
              consequence: "You spot the reversed reflection. It's not human."
            },
            {
              text: "Trust the familiar face",
              isCorrect: false,
              consequence: "Too late, you see the truth. The Aswang feeds."
            }
          ]
        },
        {
          levelIndex: 1,
          sceneText: "The creature circles, testing your awareness.",
          enrichedScene: "Shadows twist and writhe. The Aswang wears many faces now, shifting between forms. Dogs howl in the distance. You must choose wisely, or become prey.",
          choices: [
            {
              text: "Use salt and garlic to reveal it",
              isCorrect: true,
              consequence: "It recoils, hissing. You've found the truth."
            },
            {
              text: "Follow it into the dark",
              isCorrect: false,
              consequence: "The darkness swallows you. You are never seen again."
            }
          ]
        },
        {
          levelIndex: 2,
          sceneText: "The Aswang reveals its true form.",
          enrichedScene: "The creature sheds its human skin. Leathery wings unfold. Its tongue extends, impossibly long. This is your final chance to survive the night. Choose with care.",
          choices: [
            {
              text: "Strike with blessed weapons",
              isCorrect: true,
              consequence: "Your blade finds its mark. The creature flees, wounded."
            },
            {
              text: "Try to reason with it",
              isCorrect: false,
              consequence: "It laughs, a terrible sound. You become its meal."
            }
          ]
        }
      ],
      victoryTexts: [
        "The Aswang flees into the night, wounded and wary. The village is safe, for now. You are a hunter.",
        "Your blade strikes true. The creature shrieks and vanishes into darkness. Dawn breaks. The village is saved, and you stand victorious.",
        "It recoils, hissing in pain. The Aswang retreats, defeated. The roosters crow. You've survived the night, a guardian of the village."
      ],
      defeatTexts: [
        "The Aswang's hunger is satisfied. The village mourns another loss, never knowing the truth of your fate.",
        "Too slow. The creature's tongue wraps around you. Darkness. The village wakes to find you gone, another mystery unsolved.",
        "You trusted the wrong face. The Aswang feeds. By morning, you're just another disappearance, whispered about in fearful tones."
      ]
    }
  ]
};

export const fallbackUIConfig = {
  creatures: {
    "baba-yaga": {
      primaryColor: "#FFB84D",
      secondaryColor: "#FF8C42",
      fogColor: "rgba(255, 184, 77, 0.3)",
      particleType: "rune-glow",
      particleColor: "#FFD700",
      animationSpeed: 1.2,
      glowIntensity: 0.8
    },
    "banshee": {
      primaryColor: "#B8D4E8",
      secondaryColor: "#7BA8C7",
      fogColor: "rgba(184, 212, 232, 0.35)",
      particleType: "echo-wave",
      particleColor: "#E0F2FF",
      animationSpeed: 0.9,
      glowIntensity: 0.6
    },
    "aswang": {
      primaryColor: "#D32F2F",
      secondaryColor: "#8B0000",
      fogColor: "rgba(211, 47, 47, 0.4)",
      particleType: "flicker",
      particleColor: "#FF6B6B",
      animationSpeed: 1.5,
      glowIntensity: 0.9
    }
  },
  gameStates: {
    calm: {
      fogDensity: 0.3,
      particleCount: 20,
      animationIntensity: 0.5,
      screenTilt: false,
      vignette: false,
      distortion: false
    },
    tense: {
      fogDensity: 0.55,
      particleCount: 40,
      animationIntensity: 0.8,
      screenTilt: true,
      vignetteIntensity: 0.3,
      vignette: true,
      distortion: false
    },
    critical: {
      fogDensity: 0.85,
      particleCount: 60,
      animationIntensity: 1.0,
      screenTilt: true,
      vignetteIntensity: 0.6,
      vignette: true,
      distortion: true,
      distortionAmount: 0.02
    }
  },
  soundCues: {
    "choice-select": {
      descriptor: "soft-neon-chime",
      visualEffect: "ripple",
      duration: 300
    },
    "correct-choice": {
      descriptor: "warm-glow-hum",
      visualEffect: "pulse",
      duration: 500
    },
    "incorrect-choice": {
      descriptor: "hollow-echo",
      visualEffect: "shake",
      duration: 400
    },
    "level-complete": {
      descriptor: "ascending-shimmer",
      visualEffect: "ripple",
      duration: 600
    },
    "game-over": {
      descriptor: "descending-drone",
      visualEffect: "fade",
      duration: 800
    },
    "victory": {
      descriptor: "triumphant-chime",
      visualEffect: "burst",
      duration: 1000
    }
  },
  transitions: {
    stateChange: "350ms ease-in-out",
    sceneTransition: "420ms cubic-bezier(0.4, 0, 0.2, 1)",
    choiceFeedback: "200ms ease-out",
    fogShift: "500ms ease-in-out",
    particleSpawn: "300ms ease-in"
  },
  accessibility: {
    reducedMotion: {
      disableParallax: true,
      disableParticles: true,
      simplifyAnimations: true,
      staticFog: true
    },
    contrastRatios: {
      minimum: 4.5,
      enhanced: 7.0
    },
    focusRingWidth: "3px",
    focusRingColor: "#4A90E2"
  },
  performance: {
    lowPowerMode: {
      particleCount: 10,
      animationFrameRate: 30,
      simplifyEffects: true
    },
    defaultFrameRate: 60,
    particleLifetime: 5000
  }
};

import type { ContextWindowPackingLabConfig, LearningSession } from '../types'

export const contextWindowPackingLab: ContextWindowPackingLabConfig = {
  id: 'context-window-packing',
  title: 'Context Window Packing Lab',
  description: 'Pack the most useful information into a limited context window. Leave out anything that wastes space or competes with the goal.',
  capacity: 8,
  recommendedCardIds: ['system-instruction', 'user-goal', 'useful-reference', 'output-format'],
  cards: [
    {
      id: 'system-instruction',
      title: 'System instruction',
      size: 2,
      impact: 'helpful',
      explanation: 'Defines the model’s role and the rules that should govern the response.',
    },
    {
      id: 'user-goal',
      title: 'User goal',
      size: 2,
      impact: 'helpful',
      explanation: 'States the outcome the response must accomplish.',
    },
    {
      id: 'useful-reference',
      title: 'Useful reference',
      size: 2,
      impact: 'helpful',
      explanation: 'Grounds the response in relevant facts and examples.',
    },
    {
      id: 'output-format',
      title: 'Output format',
      size: 1,
      impact: 'helpful',
      explanation: 'Makes the expected structure explicit and easier to follow.',
    },
    {
      id: 'irrelevant-old-conversation',
      title: 'Irrelevant old conversation',
      size: 3,
      impact: 'harmful',
      explanation: 'Consumes scarce context without helping the current task.',
    },
    {
      id: 'unrelated-personal-detail',
      title: 'Unrelated personal detail',
      size: 2,
      impact: 'harmful',
      explanation: 'Adds noise and can pull attention away from the requested outcome.',
    },
    {
      id: 'conflicting-instruction',
      title: 'Conflicting instruction',
      size: 2,
      impact: 'harmful',
      explanation: 'Competes with the goal and makes the intended behavior ambiguous.',
    },
  ],
}

export const session01: LearningSession = {
  id: 'foundations',
  number: 1,
  title: 'Foundations of AI creation',
  items: [
    {
      id: 'how-context-shapes-an-output',
      sessionId: 'foundations',
      sessionNumber: 1,
      position: 1,
      title: 'How context shapes an output',
      kind: 'lesson',
      durationMinutes: 9,
      blocks: [
        { id: 'context-output-video', type: 'video', title: 'How context shapes an output', durationMinutes: 9, status: 'available' },
        {
          id: 'context-output-objectives',
          type: 'objectives',
          items: ['Define a model context window.', 'Recognize useful and distracting context.', 'Explain why context quality affects output quality.'],
        },
        { id: 'context-output-heading', type: 'heading', level: 2, text: 'Context is the working set' },
        {
          id: 'context-output-paragraph',
          type: 'paragraph',
          text: 'A model responds from the information available in its context window. Clear instructions, a concrete goal, and relevant references help it focus; stale or conflicting information makes the response less reliable.',
        },
        {
          id: 'context-output-check',
          type: 'comprehension-check',
          question: 'Which addition most directly improves an underspecified request?',
          options: [
            { id: 'more-history', label: 'More unrelated conversation history' },
            { id: 'clear-goal', label: 'A clear goal and expected output format' },
            { id: 'personal-detail', label: 'An unrelated personal detail' },
          ],
          correctOptionId: 'clear-goal',
          explanation: 'A clear goal and output format reduce ambiguity without wasting context capacity.',
        },
        {
          id: 'context-output-resource',
          type: 'resource',
          resources: [{
            id: 'context-window-guide',
            title: 'Context window field guide',
            type: 'Guide',
            description: 'A short reference for deciding what context belongs in a prompt.',
          }],
        },
        {
          id: 'context-output-note',
          type: 'instructor-note',
          instructor: 'Alireza Alampour · Artifact Academy',
          message: 'More context is not automatically better. Useful context earns its space by changing the quality of the answer.',
        },
      ],
    },
    {
      id: 'context-window-packing',
      sessionId: 'foundations',
      sessionNumber: 1,
      position: 2,
      title: 'Packing a useful context window',
      kind: 'lesson',
      durationMinutes: 12,
      blocks: [
        { id: 'packing-video', type: 'video', title: 'Packing a useful context window', durationMinutes: 12, status: 'available' },
        {
          id: 'packing-objectives',
          type: 'objectives',
          items: ['Prioritize context that changes the answer.', 'Remove irrelevant or conflicting information.', 'Pack a useful context window within a fixed capacity.'],
        },
        { id: 'packing-heading', type: 'heading', level: 2, text: 'Choose context deliberately' },
        {
          id: 'packing-paragraph',
          type: 'paragraph',
          text: 'Treat context like a limited working surface. Put the governing instruction and user goal first, then add only the references and format constraints that help produce the requested result.',
        },
        {
          id: 'packing-prompt',
          type: 'prompt',
          title: 'Context audit prompt',
          prompt: 'Review the context below. Label each item essential, useful, distracting, or conflicting. Then propose the smallest context set that can still produce a strong answer.',
        },
        {
          id: 'packing-resource',
          type: 'resource',
          resources: [{
            id: 'context-packing-worksheet',
            title: 'Context packing worksheet',
            type: 'Worksheet',
            description: 'A repeatable checklist for trimming a context window before sending a prompt.',
          }],
        },
        {
          id: 'packing-lab',
          type: 'interactive-lab',
          lab: 'context-window-packing',
          config: contextWindowPackingLab,
        },
        {
          id: 'packing-note',
          type: 'instructor-note',
          instructor: 'Alireza Alampour · Artifact Academy',
          message: 'A good context window is complete enough to guide the model and small enough that every item has a job.',
        },
      ],
    },
    {
      id: 'foundations-artifact',
      sessionId: 'foundations',
      sessionNumber: 1,
      position: 3,
      title: 'Creator workflow map',
      kind: 'assignment',
      durationMinutes: 30,
      blocks: [
        { id: 'foundations-artifact-heading', type: 'heading', level: 2, text: 'Assignment brief' },
        {
          id: 'foundations-artifact-paragraph',
          type: 'paragraph',
          text: 'Map one creator workflow and identify where context is introduced, refined, or removed.',
        },
        {
          id: 'foundations-artifact-assignment',
          type: 'artifact-assignment',
          assignment: {
            title: 'Creator workflow map',
            description: 'Complete the Session 1 artifact and submit it here for instructor review.',
            deliverables: ['A public or preview URL', 'A source repository URL', 'A short note for the instructor'],
          },
        },
      ],
    },
  ],
}

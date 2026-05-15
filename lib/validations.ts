import { z } from 'zod'

export const scoreSubmissionSchema = z.object({
  week_id: z.number().int().positive(),
  team_id: z.number().int().positive(),
  player1_score: z.number().int().min(0, 'Score must be 0 or higher'),
  player2_score: z.number().int().min(0, 'Score must be 0 or higher'),
})

export type ScoreSubmission = z.infer<typeof scoreSubmissionSchema>

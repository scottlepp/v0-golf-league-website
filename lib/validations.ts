import { z } from 'zod'

export const scoreSubmissionSchema = z.object({
  week_id: z.number().int().positive(),
  team_id: z.number().int().positive(),
  player1_score: z.number().int().min(0, 'Score must be 0 or higher'),
  player2_score: z.number().int().min(0, 'Score must be 0 or higher'),
  // Optional per-hole arrays — when present must match course hole count and be strokes >= 1.
  player1_holes: z.array(z.number().int().min(1).max(20)).optional(),
  player2_holes: z.array(z.number().int().min(1).max(20)).optional(),
})

export type ScoreSubmission = z.infer<typeof scoreSubmissionSchema>

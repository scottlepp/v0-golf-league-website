'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'

const scoreSubmissionSchema = z.object({
  team_id: z.coerce.number().int().positive('Please select a team'),
  player1_score: z.coerce.number().int().min(0, 'Score must be 0 or higher'),
  player2_score: z.coerce.number().int().min(0, 'Score must be 0 or higher'),
})

type ScoreSubmissionFormData = z.infer<typeof scoreSubmissionSchema>

interface Team {
  id: number
  name: string
  player1_name: string
  player2_name: string
}

interface Props {
  weekId: number
  onSuccess: () => void
  submitMessage: string
}

export default function ScoreSubmissionForm({ weekId, onSuccess, submitMessage }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    fetch('/api/teams')
      .then((r) => r.json())
      .then(setTeams)
      .catch(console.error)
  }, [])

  const form = useForm<ScoreSubmissionFormData>({
    resolver: zodResolver(scoreSubmissionSchema),
    defaultValues: {
      team_id: undefined,
      player1_score: 0,
      player2_score: 0,
    },
  })

  const player1Score = Number(form.watch('player1_score')) || 0
  const player2Score = Number(form.watch('player2_score')) || 0
  const totalScore = player1Score + player2Score

  const onSubmit = async (data: ScoreSubmissionFormData) => {
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week_id: weekId,
          team_id: data.team_id,
          player1_score: Number(data.player1_score),
          player2_score: Number(data.player2_score),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        setErrorMessage(error.error || 'Failed to submit scores')
        return
      }

      form.reset({ team_id: undefined, player1_score: 0, player2_score: 0 })
      onSuccess()
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.')
      console.error('Error submitting scores:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Scores</CardTitle>
        <CardDescription>Enter your team&apos;s scores for Week {weekId}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
            {submitMessage && (
              <Alert className="bg-green-50 border-green-200">
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">{submitMessage}</AlertDescription>
              </Alert>
            )}

            {errorMessage && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Team Selection */}
            <FormField
              control={form.control}
              name="team_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Select Your Team</FormLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(val) => field.onChange(parseInt(val))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a team" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          {team.name} — {team.player1_name} & {team.player2_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Player 1 Score */}
            <FormField
              control={form.control}
              name="player1_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Player 1 Score</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      className="text-lg font-mono"
                      min="0"
                    />
                  </FormControl>
                  <FormDescription>Lower score is better</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Player 2 Score */}
            <FormField
              control={form.control}
              name="player2_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Player 2 Score</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      className="text-lg font-mono"
                      min="0"
                    />
                  </FormControl>
                  <FormDescription>Lower score is better</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Total Score Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Total Score</p>
              <p className="text-2xl font-bold text-blue-900 font-mono">{totalScore}</p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 h-auto"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  <span>Submitting...</span>
                </div>
              ) : (
                'Submit Scores'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

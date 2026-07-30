export const RATING_VALUES = [1, 2, 3, 4, 5] as const

export type RatingValue = (typeof RATING_VALUES)[number]

export type AppView = 'rating' | 'thank-you'

export type AppState = {
  view: AppView
  selectedRating: RatingValue | null
  validationMessage: string | null
}

export function isRatingValue(value: number): value is RatingValue {
  return RATING_VALUES.includes(value as RatingValue)
}

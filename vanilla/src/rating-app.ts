import starIcon from './assets/icon-star.svg'
import thankYouIllustration from './assets/illustration-thank-you.svg'
import { isRatingValue, RATING_VALUES } from './rating-types'
import type { AppState, RatingValue } from './rating-types'

const VALIDATION_MESSAGE = 'Please select a rating before submitting.'

export function mountRatingApp(root: HTMLElement): void {
  const main = document.createElement('main')
  main.className = 'rating-app'
  main.setAttribute('aria-live', 'polite')
  root.replaceChildren(main)

  const state: AppState = {
    view: 'rating',
    selectedRating: null,
    validationMessage: null,
  }

  renderCurrentView(main, state)
}

function renderCurrentView(main: HTMLElement, state: AppState): void {
  if (state.view === 'thank-you' && state.selectedRating !== null) {
    renderThankYouView(main, state.selectedRating)
    return
  }

  renderRatingView(main, state)
}

function renderRatingView(main: HTMLElement, state: AppState): void {
  main.innerHTML = `
    <article class="card card--rating">
      <div class="rating-badge">
        <img src="${starIcon}" alt="" width="17" height="16">
      </div>
      <h1>How did we do?</h1>
      <p class="rating-intro">Please let us know how we did with your support request. All feedback is appreciated to help us improve our offering!</p>
      <form id="rating-form" class="rating-form" novalidate>
        <fieldset aria-describedby="rating-error">
          <legend class="visually-hidden">Choose a rating from 1 to 5</legend>
          <div class="rating-options">
            ${RATING_VALUES.map((value) => renderRatingOption(value)).join('')}
          </div>
        </fieldset>
        <p id="rating-error" class="rating-error" role="alert" hidden>${VALIDATION_MESSAGE}</p>
        <button class="submit-button" type="submit">SUBMIT</button>
      </form>
    </article>
  `

  const form = main.querySelector<HTMLFormElement>('#rating-form')
  const radios = Array.from(main.querySelectorAll<HTMLInputElement>('input[name="rating"]'))
  const error = main.querySelector<HTMLParagraphElement>('#rating-error')

  if (!form || !error || radios.length !== RATING_VALUES.length) {
    throw new Error('Interactive rating form failed to initialize.')
  }

  form.addEventListener('change', (event) => {
    const target = event.target
    if (!(target instanceof HTMLInputElement) || target.type !== 'radio' || target.name !== 'rating') {
      return
    }

    const value = Number(target.value)
    if (!isRatingValue(value)) {
      return
    }

    state.selectedRating = value
    state.validationMessage = null
    clearValidation(radios, error)
  })

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    const submittedValue = new FormData(form).get('rating')
    const value = typeof submittedValue === 'string' ? Number(submittedValue) : Number.NaN

    if (!isRatingValue(value)) {
      state.view = 'rating'
      state.selectedRating = null
      state.validationMessage = VALIDATION_MESSAGE
      showValidation(radios, error)
      radios[0].focus({ preventScroll: true })
      return
    }

    state.view = 'thank-you'
    state.selectedRating = value
    state.validationMessage = null
    renderCurrentView(main, state)
  })
}

function renderRatingOption(value: RatingValue): string {
  return `
    <label class="rating-option" for="rating-${value}">
      <input class="rating-option__input" id="rating-${value}" name="rating" type="radio" value="${value}" required>
      <span class="rating-option__surface">
        <span class="visually-hidden">${value} out of 5</span>
        <span aria-hidden="true">${value}</span>
      </span>
    </label>
  `
}

function showValidation(radios: HTMLInputElement[], error: HTMLParagraphElement): void {
  error.hidden = false
  for (const radio of radios) {
    radio.setAttribute('aria-invalid', 'true')
  }
}

function clearValidation(radios: HTMLInputElement[], error: HTMLParagraphElement): void {
  error.hidden = true
  for (const radio of radios) {
    radio.removeAttribute('aria-invalid')
  }
}

function renderThankYouView(main: HTMLElement, rating: RatingValue): void {
  main.innerHTML = `
    <article class="card card--thank-you">
      <div class="thank-you-content">
        <img class="thank-you-illustration" src="${thankYouIllustration}" alt="" width="162" height="108">
        <p class="rating-result">You selected ${rating} out of 5</p>
        <div class="thank-you-message">
          <h1 tabindex="-1">Thank you!</h1>
          <p>We appreciate you taking the time to give a rating.<br class="desktop-break"> If you ever need more support, don’t hesitate to<br class="desktop-break"> get in touch!</p>
        </div>
      </div>
    </article>
  `

  const heading = main.querySelector<HTMLHeadingElement>('h1')
  if (!heading) {
    throw new Error('Thank-you heading failed to render.')
  }

  heading.focus({ preventScroll: true })
}

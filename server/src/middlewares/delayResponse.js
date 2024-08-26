export const delayResponse = (duration) => {
  return (req, res, next) => {
    setTimeout(() => next(), duration)
  }
}

import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError =>
  'data' in error && 'status' in error

const isErrorWithMessage = (error: any): error is { message: string } =>
  typeof error === 'object' &&
  error !== null &&
  'message' in error &&
  typeof error.message === 'string'

const handleError = (error: FetchBaseQueryError | SerializedError) => {
  if (isFetchBaseQueryError(error)) {
    const errorMessage = error.data as { message: string }
    return errorMessage.message
  } else if (isErrorWithMessage(error)) {
    return error.message
  }
  return 'Unknown error'
}

export { handleError }

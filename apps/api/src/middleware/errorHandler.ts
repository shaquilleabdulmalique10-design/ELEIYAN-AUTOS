import type { Request, Response, NextFunction } from 'express'

export function errorHandler(
  err: Error & { status?: number; statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  console.error(`[Error] ${status} — ${message}`)

  res.status(status).json({
    error: status >= 500 ? 'Internal Server Error' : 'Error',
    message: status >= 500 && process.env.NODE_ENV === 'production' ? 'Something went wrong' : message,
    statusCode: status,
  })
}

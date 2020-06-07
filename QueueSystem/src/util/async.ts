import { Request, Response, NextFunction } from 'express'

const Layer = require('express/lib/router/layer')

Layer.prototype.handle_error = function handle_error(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const fn = this.handle

  if (fn.length !== 4) {
    return next(error)
  }

  try {
    const p = fn(error, req, res, next)

    if (promiseLike(p)) p.catch(next)
  } catch (err) {
    next(err)
  }
}

Layer.prototype.handle_request = function handle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const fn = this.handle

  if (fn.length > 3) {
    // not a standard request handler
    return next()
  }

  try {
    const p = fn(req, res, next)

    if (promiseLike(p)) p.catch(next)
  } catch (err) {
    next(err)
  }
}

const promiseLike = (p: any) =>
  p && typeof p.then === 'function' && typeof p.catch === 'function'

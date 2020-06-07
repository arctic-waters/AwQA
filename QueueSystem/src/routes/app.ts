import { Request, Response, Router, NextFunction } from 'express'

import { app, application } from '..'
import { User } from '../model'

const api = Router()

api.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.user = application.users.find((v) => v.uuid === req.query.id)

  if (res.locals.user)
    res.locals.u = {
      locationsCurrent: (res.locals.user as User).locationsCurrent,
      locationsQueued: (res.locals.user as User).locationsQueued,
      locationsWaiting: (res.locals.user as User).locationsWaiting,
      positions: (res.locals.user as User).positions.map((v) => ({
        location: v.location,
        position: v.position.position,
      })),
      waitingTimes: (res.locals.user as User).waitingTimes.map((v) => ({
        timestamp: v.timeout.getTime(),
        location: v.location,
      })),
    }

  next()
})

api.get('/dashboard', (req: Request, res: Response) => {
  if (!res.locals.user) {
    res.redirect('/')
    return
  }

  res.render('user_dashboard.hbs')
})

api.get('/locations', (req: Request, res: Response) => {
  res.locals.locations = application.locations
  res.render('user_locations.hbs')
})

api.post('/join', (req: Request, res: Response) => {
  const { loc_id, id } = req.body

  const location = application.locations.find((v) => v.uuid === loc_id)
  const user = application.users.find((v) => v.uuid === id)

  if (!user) {
    res.redirect('/')
    return
  }

  if (!location) {
    res.redirect(`/user/dashboard?id=${user.uuid}`)
    return
  }

  location.enter(user)
  res.redirect(`/user/dashboard?id=${user.uuid}`)
})

api.post('/cancel', (req: Request, res: Response) => {
  const { loc_id, id } = req.body

  const location = application.locations.find((v) => v.uuid === loc_id)
  const user = application.users.find((v) => v.uuid === id)

  if (!user) {
    res.redirect('/')
    return
  }

  if (!location) {
    res.redirect(`/user/dashboard?id=${user.uuid}`)
    return
  }

  location.current = location.current.filter((v) => v.uuid !== user.uuid)
  location.waiting = location.waiting.filter((v) => v.user.uuid !== user.uuid)
  location.queue = location.queue.filter((v) => v.user.uuid !== user.uuid)

  res.redirect(`/user/dashboard?id=${user.uuid}`)
})

api.post('/leave', (req: Request, res: Response) => {
  const { loc_id, id } = req.body

  const location = application.locations.find((v) => v.uuid === loc_id)
  const user = application.users.find((v) => v.uuid === id)

  if (!user) {
    res.redirect('/')
    return
  }

  if (!location) {
    res.redirect(`/user/dashboard?id=${user.uuid}`)
    return
  }

  location.leave(user)
  res.redirect(`/user/dashboard?id=${user.uuid}`)
})

api.post('/queue', (req: Request, res: Response) => {
  const { loc_id, id } = req.body

  const location = application.locations.find((v) => v.uuid === loc_id)
  const user = application.users.find((v) => v.uuid === id)

  if (!user) {
    res.redirect('/')
    return
  }

  if (!location) {
    res.redirect(`/user/dashboard?id=${user.uuid}`)
    return
  }

  location.addToQueue(user)
  res.redirect(`/user/dashboard?id=${user.uuid}`)
})

api.get('/settings', (req: Request, res: Response) => {
  if (!res.locals.user) {
    res.redirect('/')
    return
  }

  res.render('user_settings.hbs')
})

api.get('/delete', (req: Request, res: Response) => {
  if (!res.locals.user) {
    res.redirect('/')
    return
  }

  application.users = application.users.filter(
    (v) => v.uuid !== res.locals.user.uuid
  )

  res.redirect('/')
})

api.post('/update', (req: Request, res: Response) => {
  const { name, id } = req.body

  const user: User | undefined = application.users.find((v) => v.uuid === id)

  if (!user) res.redirect('/')

  user!!.name = name
  res.redirect(`/user/dashboard?id=${user!!.uuid}`)
})

api.get('/new', (req: Request, res: Response) => {
  res.render('user_new.hbs')
})

api.post('/create', (req: Request, res: Response) => {
  const { name } = req.body
  const user: User = application.createUser({ name })
  res.redirect(`/user/dashboard?id=${user.uuid}`)
})

app.use('/user', api)

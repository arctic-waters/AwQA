import { Request, Response, Router, NextFunction } from 'express'

import { app, application } from '..'
import { Location } from '../model'

const api = Router()

api.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.location = application.locations.find(
    (v) => v.uuid === req.query.id
  )

  if (res.locals.location) {
    res.locals.l = {
      waiting: (res.locals.location as Location).waiting.map((v) => ({
        user: v.user,
        timestamp: v.timeout.getTime(),
      })),

      queue: (res.locals.location as Location).queue.map((v) => ({
        user: v.user,
        position: v.position,
      })),
    }
  }

  next()
})

api.get('/dashboard', (req: Request, res: Response) => {
  if (!res.locals.location) {
    res.redirect('/')
    return
  }

  res.render('location_dashboard.hbs')
})

api.get('/settings', (req: Request, res: Response) => {
  if (!res.locals.location) {
    res.redirect('/')
    return
  }

  res.render('location_settings.hbs')
})

api.get('/delete', (req: Request, res: Response) => {
  if (!res.locals.location) {
    res.redirect('/')
    return
  }

  application.locations = application.locations.filter(
    (v) => v.uuid !== res.locals.location.uuid
  )

  res.redirect('/')
})

api.post('/kick', (req: Request, res: Response) => {
  const { user_id, id } = req.body

  const location = application.locations.find((v) => v.uuid === id)
  const user = application.users.find((v) => v.uuid === user_id)

  if (!location) {
    res.redirect('/')
    return
  }

  if (!user) {
    res.redirect(`/location/dashboard?id=${location.uuid}`)
    return
  }

  location.leave(user)
  res.redirect(`/location/dashboard?id=${location.uuid}`)
})

api.post('/update', (req: Request, res: Response) => {
  const { name, description, capacity, window, id } = req.body

  const numCapacity = parseInt(capacity)
  const numWindow = parseInt(window)

  const numCapacitySafe = isNaN(numCapacity) ? 10 : numCapacity
  const numWindowSafe = isNaN(numWindow) ? 10 : numWindow

  const location: Location | undefined = application.locations.find(
    (v) => v.uuid === id
  )

  if (!location) res.redirect(`/`)

  location!!.name = name
  location!!.description = description
  location!!.capacity = numCapacitySafe
  location!!.window = numWindowSafe

  res.redirect(`/location/dashboard?id=${location!!.uuid}`)
})

api.get('/new', (req: Request, res: Response) => {
  res.render('location_new.hbs')
})

api.post('/create', (req: Request, res: Response) => {
  const { name, description, capacity, window, loc_x, loc_y } = req.body

  const numCapacity = parseInt(capacity)
  const numWindow = parseInt(window)

  const numLoc_x = parseFloat(loc_x)
  const numLoc_y = parseFloat(loc_y)

  if (isNaN(numLoc_x) || isNaN(numLoc_y)) {
    res.redirect(`/location/new`)
    return
  }

  const numCapacitySafe = isNaN(numCapacity) ? 10 : numCapacity
  const numWindowSafe = isNaN(numWindow) ? 10 : numWindow

  const location: Location = application.createLocation({
    name,
    description,
    capacity: numCapacitySafe,
    window: numWindowSafe,
    location: [numLoc_x, numLoc_y],
  })

  res.redirect(`/location/dashboard?id=${location.uuid}`)
})

app.use('/location', api)

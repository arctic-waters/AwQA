import './util/async'

import { urlencoded, json, raw } from 'body-parser'
import express from 'express'
import { hbs } from './util'

import { Application } from './model'

export const application = new Application()
export const app = express()

hbs(app)

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(raw())

import './routes/resources'
import './routes/landing'
import './routes/admin'
import './routes/app'

app.get('*', (req: express.Request, res: express.Response) => res.redirect('/'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  setInterval(() => {
    for (const location of application.locations) location.update()
  }, 10_000)

  console.log('Application launched and listening on port ' + PORT)
})

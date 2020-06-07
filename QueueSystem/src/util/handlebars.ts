import path from 'path'

import { Application } from 'express'
import handlebars from 'express-handlebars'

export function hbs(app: Application) {
  app.set('view engine', 'hbs')
  app.set('views', path.join(__dirname, '..', '..', 'assets', 'views'))
  app.engine(
    'hbs',
    handlebars.create({
      extname: 'hbs',

      layoutsDir: path.join(
        __dirname,
        '..',
        '..',
        'assets',
        'views',
        'layouts'
      ),
      partialsDir: path.join(
        __dirname,
        '..',
        '..',
        'assets',
        'views',
        'partials'
      ),
      defaultLayout: 'main',

      helpers: {
        json: (context: any, pretty: boolean = false): string =>
          JSON.stringify(context, null, pretty ? 2 : undefined),

        time_left: (date: number): string => {
          const amount = (date - new Date().getTime()) / 1000

          if (amount < 0) return 'EXPIRED'

          return `${amount.toFixed(2)}s`
        },
      },
    }).engine
  )
}

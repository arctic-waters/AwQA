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

        time_left: (date: number): number => {
          const amount = (date - new Date().getTime()) / 1000
          return Math.floor(Math.max(amount, 0))
        },

        estimate_time: (position: number, capacity: number) => {
          const averageTime: number = 60 * 2 ** Math.PI
          const noise: number = 0.2

          const est = (position * averageTime) / capacity
          const na = est * noise

          return Math.floor(
            ((a: number, b: number) => Math.random() * (b - a) + a)(
              est - na,
              est + na
            )
          )
        },

        fancy_time: function (time: number) {
          var hrs = ~~(time / 3600)
          var mins = ~~((time % 3600) / 60)
          var secs = ~~time % 60

          var ret = ''

          if (hrs > 0) {
            ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
          }

          ret += '' + mins + ':' + (secs < 10 ? '0' : '')
          ret += '' + secs
          return ret
        },
      },
    }).engine
  )
}

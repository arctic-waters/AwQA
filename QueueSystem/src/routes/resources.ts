import path from 'path'

import express from 'express'

import { app } from '..'

app.use('/public', express.static(path.join(__dirname, '..', 'public')))

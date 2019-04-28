const express = require('express')
const router = express.Router()
const request = require('superagent') 
const {
  getAbsoluteURL,
  appendParamsToURL,
  loadSession,
  redirectWithError,
  redirectWithData
} = require('./../helpers')

const GOOGLE_BASE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth?'
const GOOGLE_BASE_API_URL = 'https://www.googleapis.com'

router.get('/auth', async (req, res) => {
  req.session.redirect = req.query.redirect

  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    scope: 'email',
    response_type: 'code',
    state: req.sessionID,
    redirect_uri: getAbsoluteURL('/google/verify')
  }

  const authUrl = appendParamsToURL(GOOGLE_BASE_AUTH_URL, params)

  res.redirect(authUrl)
})

router.get('/verify', async (req, res) => {
  const { state: sessionID, code } = req.query
  const session = await loadSession(sessionID, req)

  if (!session) {
    return res
      .status(400)
      .send({
        errors: ["Invalid session"]
      })
  }

  const { redirect } = session

  // verify code and get access token
  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: getAbsoluteURL('/google/verify'),
    code: code,
    grant_type: 'authorization_code',
    state: sessionID
  }

  let accessToken
  try {
    const response = await request
      .post(GOOGLE_BASE_API_URL + '/oauth2/v4/token')
      .query(params)
    accessToken = response.body.access_token
  } catch {
    return redirectWithError(res, redirect, 'Cannot get access token')
  }

  // Get email id
  let userDataResponse
  try {
    userDataResponse = await request
      .get(GOOGLE_BASE_API_URL + '/oauth2/v2/userinfo')
      .query({
        access_token: accessToken
      })
  } catch {
    return redirectWithError(res, redirect, 'Error validating access token')
  }

  const { email } = userDataResponse.body

  session.google_email = email

  return redirectWithData(res, redirect, {
    email
  })
})

module.exports = router
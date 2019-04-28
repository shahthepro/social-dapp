
function getAbsoluteURL(relativeUrl, params) {
  const protocol = process.env.HTTPS ? 'https' : 'http'
  const host = process.env.HOST ? process.env.HOST : 'localhost:4000'
  const url = `${protocol}://${host}${relativeUrl}`

  return appendParamsToURL(url, params)
}

function appendParamsToURL(url, params) {
  if (!params) {
    return url
  }

  const _url = new URL(url)

  for (let key in params) {
    _url.searchParams.append(key, params[key] || '')
  }

  return _url.toString()
}

function loadSession(sessionID, req) {
  return new Promise((resolve, reject) => {
    req.redisSessionStore.load(sessionID, (err, session) => {
      if (err) {
        reject(err)
      } else {
        resolve(session)
      }
    })
  })
}

function redirectWithError(res, redirect, error) {
  return redirectTo(res, redirect, {
    success: true,
    error
  })
}

function redirectWithData(res, redirect, data) {
  return redirectTo(res, redirect, {
    success: false,
    data: JSON.stringify(data)
  })
}

function redirectTo(res, redirect, { success, error, data }) {
  res.redirect(appendParamsToURL(redirect, {
    success,
    error,
    data
  }))
}

module.exports = {
  getAbsoluteURL,
  appendParamsToURL,
  loadSession,
  redirectWithData,
  redirectWithError
}
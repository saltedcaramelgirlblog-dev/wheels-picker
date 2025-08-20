export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
    const { postUrl, mediaId } = body || {}

    const IG_APP_ID = process.env.IG_APP_ID
    const IG_APP_SECRET = process.env.IG_APP_SECRET
    const IG_USER_ACCESS_TOKEN = process.env.IG_USER_ACCESS_TOKEN
    const IG_USER_ID = process.env.IG_USER_ID

    if (!IG_USER_ACCESS_TOKEN) {
      res.status(500).json({ error: 'Missing IG_USER_ACCESS_TOKEN in env' })
      return
    }

    let resolvedMediaId = mediaId

    // Resolve media id from a post URL using oEmbed first
    if (!resolvedMediaId && postUrl) {
      try {
        if (!IG_APP_ID || !IG_APP_SECRET) {
          throw new Error('Missing IG_APP_ID/IG_APP_SECRET')
        }
        const oembedUrl = `https://graph.facebook.com/v17.0/instagram_oembed?url=${encodeURIComponent(
          postUrl
        )}&access_token=${IG_APP_ID}|${IG_APP_SECRET}`
        const oembedResp = await fetch(oembedUrl)
        const oembed = await oembedResp.json()
        if (oembed.media_id) resolvedMediaId = oembed.media_id
      } catch (e) {
        // ignore and try fallback
      }
    }

    // Fallback: search recent media for a matching permalink if we have user id
    if (!resolvedMediaId && postUrl && IG_USER_ID) {
      try {
        const mediaListUrl = `https://graph.facebook.com/v17.0/${IG_USER_ID}/media?fields=id,permalink,caption&limit=100&access_token=${IG_USER_ACCESS_TOKEN}`
        const mediaResp = await fetch(mediaListUrl)
        const media = await mediaResp.json()
        if (media && Array.isArray(media.data)) {
          const match = media.data.find((m) => m.permalink && postUrl.indexOf(m.permalink) !== -1)
          if (match) resolvedMediaId = match.id
        }
      } catch (e) {
        // ignore
      }
    }

    if (!resolvedMediaId) {
      res.status(400).json({ error: 'Unable to resolve media id. Provide mediaId or a valid Instagram Post URL.' })
      return
    }

    // Fetch all comments
    const usernamesSet = new Set()
    let next = `https://graph.facebook.com/v17.0/${resolvedMediaId}/comments?fields=id,text,username,timestamp&limit=50&access_token=${IG_USER_ACCESS_TOKEN}`

    while (next) {
      const resp = await fetch(next)
      const json = await resp.json()
      if (json.error) {
        res.status(400).json({ error: json.error.message || 'Graph error', details: json.error })
        return
      }
      if (json && Array.isArray(json.data)) {
        json.data.forEach((c) => {
          if (c && c.username) usernamesSet.add(c.username)
        })
      }
      next = json.paging && json.paging.next ? json.paging.next : null
    }

    const usernames = Array.from(usernamesSet)
    res.status(200).json({ usernames, mediaId: resolvedMediaId, count: usernames.length })
  } catch (e) {
    res.status(500).json({ error: 'Internal error', message: e.message })
  }
}








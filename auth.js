import { Cookies } from 'react-cookie'
import store from 'store'

export async function handleAccessToken() {
  const issueTokenURL = `${process.env.API_HOST}/tokens`

  // first, try and get a token from the localStorage
  let accessToken = store.get('accessToken')
  console.log('No token un localstorage: ', accessToken === undefined)

  if (accessToken === undefined) {
    // Given that  there's no token, get one
    fetch(issueTokenURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'dlobo',
        password: 'Daniel!123'
      })
    })
      .then(async res => {
        const response = await res.json()
        store.set('tokenID', response.id)
        store.set('accessToken', response.accessToken)
        store.set('refreshToken', response.refreshToken)
        console.log('Access token from Store: ', store.get('accessToken'))
      })
      .then(res => {
        // console.log(res);
        return accessToken
      })
  } else if (
    !(
      JSON.parse(atob(accessToken.split('.')[1])).exp -
        ((Date.now() / 1000) >> 0) >
      300
    )
  ) {
    console.log('Need to refresh the access token.')

    const refreshTokenURL = `${process.env.API_HOST}/tokens/${store.get(
      'tokenID'
    )}/refresh`

    fetch(refreshTokenURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('refreshToken')
      }
    })
      .then(async res => {
        const response = await res.json()
        // console.log("REFRESH TOKEN RESPONSE ", response);
        store.set('c', response.accessToken)
        store.set('refreshToken', response.refreshToken)

        // override old accessToken
        accessToken = store.get('accessToken')
        // console.log("The new accessToken is: ", accessToken);
      })
      .then(() => {
        console.log('I have a NEW accessToken: ', accessToken)
        return accessToken
      })
  } else {
    console.log('No need to refresh.')
    console.log('JWT es valido? ', isJWTValid)
    return accessToken
  }
}

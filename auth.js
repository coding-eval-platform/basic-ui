import store from 'store'

export async function handleAccessToken() {
  const issueTokenURL = `${process.env.API_HOST}/tokens`

  // first, try and get a token from the localStorage
  let accessToken = store.get('accessToken')
  console.log('Token in localStorage? ', accessToken != undefined)

  if (accessToken === undefined) {
    // THIS SHOULD NEVER HAPPEN
    // // Given that  there's no token, get one
    // // console.log('getting new token: ', issueTokenURL)
    // console.log("Token undefined, getting a new one.");
    // // window.location.reload();
    // fetch(issueTokenURL, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     username: "dlobo",
    //     password: "Daniel!123"
    //   })
    // })
    //   .then(r => r.json().then(data => ({ status: r.status, body: data })))
    //   .then(obj => {
    //     console.log("obj: ", obj);
    //     return obj;
    //   });
  } else if (
    JSON.parse(atob(accessToken.split('.')[1])).exp <
    (Date.now() / 1000) >> 0
  ) {
    console.log('REFRESHING.')
    console.log(
      'Access token older than 5min? ',
      JSON.parse(atob(accessToken.split('.')[1])).exp < (Date.now() / 1000) >> 0
    )

    const refreshTokenURL = `${process.env.API_HOST}/tokens/${store.get(
      'tokenID'
    )}/refresh`

    console.log('refreshtokenurl', refreshTokenURL)
    fetch(refreshTokenURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('refreshToken')
      }
    })
      .then(async res => {
        const response = await res.json()
        store.set('accessToken', response.accessToken)
        store.set('refreshToken', response.refreshToken)
        store.set(
          'username',
          JSON.parse(atob(response.accessToken.split('.')[1])).sub
        )
        store.set(
          'roles',
          JSON.parse(atob(response.accessToken.split('.')[1])).roles
        )

        // override old accessToken
        accessToken = store.get('accessToken')
        // console.log("The new accessToken is: ", accessToken);
      })
      .then(() => {
        console.log('I have a NEW accessToken: ', accessToken)
        window.location.reload()
        return accessToken
      })
  } else {
    console.log('NO REFRESH.')
    console.log(
      'Access token older than 5min?',
      JSON.parse(atob(accessToken.split('.')[1])).exp -
        ((Date.now() / 1000) >> 0) >
        300
    )
    return accessToken
  }
}

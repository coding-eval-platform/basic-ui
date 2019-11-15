import store from 'store'

export async function handleAccessToken() {
  // const issueTokenURL = `${process.env.API_HOST}/tokens`;

  // first, try and get a token from the localStorage
  let accessToken = store.get('accessToken')
  // console.log("Token in localStorage? ", accessToken != undefined);

  if (accessToken === undefined) {
    // THIS SHOULD NEVER HAPPEN
    // // Given that  there's no token, get one
  } else if (
    JSON.parse(atob(accessToken.split('.')[1])).exp <
    (Date.now() / 1000) >> 0
  ) {
    // console.log("REFRESHING.");
    // console.log(
    //   "Access token older than 5min? ",
    //   JSON.parse(atob(accessToken.split(".")[1])).exp < (Date.now() / 1000) >> 0
    // );

    const refreshTokenURL = `${process.env.API_HOST}/tokens/${store.get(
      'tokenId'
    )}/refresh`

    // console.log("refreshtokenurl", refreshTokenURL);
    fetch(refreshTokenURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + store.get('refreshToken')
      }
    })
      .then(async res => {
        const response = await res.json()
        // console.log("- Old accessToken: Overriding", response);
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
        // accessToken = store.get("accessToken");
        // console.log("The new accessToken is: ", accessToken);
      })
      .then(() => {
        // console.log("- I have a NEW accessToken: ", store.get("accessToken"));
        // window.location.reload()
        return store.get('accessToken')
      })
  } else {
    // console.log("* NO REFRESH.");
    // console.log(
    //   "* Access token older than 5min?",
    //   JSON.parse(atob(accessToken.split(".")[1])).exp -
    //     ((Date.now() / 1000) >> 0) >
    //     300
    // );
    // window.location.reload()
    return accessToken
  }
}

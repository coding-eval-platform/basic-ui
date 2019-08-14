import axios from 'axios'
import Router from 'next/router'
import { Cookies } from 'react-cookie'
import store from 'store'

const cookies = new Cookies()

export async function handleAccessToken() {
  const issueTokenURL = `${process.env.API_HOST}/tokens`

  // first, try and get a token from the localStorage
  const accessToken = store.get('accessToken')
  console.log('TOKEN UNDEFINED: ', accessToken === undefined)

  if (accessToken === undefined) {
    // get a token
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
        console.log('EHHHH ', response)
        console.log('accessToken ', response.accessToken)
        console.log('refreshToken ', response.refreshToken)
        store.set('tokenID', response.id)
        store.set('accessToken', response.accessToken)
        store.set('refreshToken', response.refreshToken)
        console.log(store.get('accessToken'))
      }) // OR res.json()
      .then(res => console.log(res))
  } else if (
    !JSON.parse(atob(accessToken.split('.')[1])).exp -
      ((Date.now() / 1000) >> 0) >
    60
  ) {
    const isJWTValid =
      JSON.parse(atob(accessToken.split('.')[1])).exp -
        ((Date.now() / 1000) >> 0) >
      60
    // check if jwt is expired or not
    // console.log(atob(accessToken.split(".")[1]).exp);

    console.log('valido??? ', isJWTValid)

    console.log('I have an accessToken: ', accessToken)
    return accessToken
  } else {
    // if JWT not expired
    const isJWTValid =
      JSON.parse(atob(accessToken.split('.')[1])).exp -
        ((Date.now() / 1000) >> 0) >
      60
    console.log('valido--- ', isJWTValid)
  }
}

//   try {
//     const response = await axios.get(serverUrl + "/api/token/ping", {
//       headers: { Authorization: token }
//     });
//     // dont really care about response, as long as it not an error
//     console.log("token ping:", response.data.msg);
//   } catch (err) {
//     // in case of error
//     console.log(err.response.data.msg);
//     console.log("redirecting back to main page");
//     // redirect to login
//     if (ctx.res) {
//       ctx.res.writeHead(302, {
//         Location: "/"
//       });
//       ctx.res.end();
//     } else {
//       Router.push("/");
//     }
//   }
// }

// export async function handleAuthSSR(ctx) {
//   let token = null;

//   // if context has request info aka Server Side
//   if (ctx.req) {
//     // ugly way to get cookie value from a string of values
//     // good enough for demostration
//     token = ctx.req.headers.cookie.replace(
//       /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
//       "$1"
//     );
//   } else {
//     // we dont have request info aka Client Side
//     token = cookies.get("token");
//   }

//   try {
//     const response = await axios.get(
//       `${process.env.API_HOST} + "/api/token/ping", { headers: { 'Authorization': token } }`
//     );
//     // dont really care about response, as long as it not an error
//     console.log("token ping:", response.data.msg);
//   } catch (err) {
//     // in case of error
//     console.log(err.response.data.msg);
//     console.log("redirecting back to main page");
//     // redirect to login
//     if (ctx.res) {
//       ctx.res.writeHead(302, {
//         Location: "/"
//       });
//       ctx.res.end();
//     } else {
//       Router.push("/");
//     }
//   }
// }

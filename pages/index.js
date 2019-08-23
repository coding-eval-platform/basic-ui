import { Button } from '@material-ui/core'
import Layout from '../components/MyLayout.js'
import Typography from '@material-ui/core/Typography'

import store from 'store'

export default () => {
  return (
    <Layout>
      {store.get('username') === undefined ? (
        <div>
          <Typography style={{ margin: 8 }} variant="h5" gutterBottom>
            Welcome to the Coding Evaluation Platform 🚀
          </Typography>
          <Typography style={{ margin: 8 }} variant="h5" gutterBottom>
            New user?
            <Button
              variant="outlined"
              color="primary"
              href="/signup"
              style={{ textTransform: 'none', margin: 20 }}
            >
              Sign up here
            </Button>
          </Typography>
          <Typography style={{ margin: 8 }} variant="h5" gutterBottom>
            Existing user?
            <Button
              variant="outlined"
              color="primary"
              href="/login"
              style={{ textTransform: 'none', margin: 20 }}
            >
              Login here
            </Button>
          </Typography>
        </div>
      ) : (
        <div>
          <Typography style={{ margin: 8 }} variant="h5" gutterBottom>
            Welcome to the Coding Evaluation Platform, {store.get('username')}{' '}
            🚀
          </Typography>
          <Typography style={{ margin: 8 }} variant="h6" gutterBottom>
            Want to change your password?
            <Button
              variant="outlined"
              color="primary"
              href="/change-password"
              style={{ textTransform: 'none', margin: 20 }}
            >
              Change password
            </Button>
          </Typography>
        </div>
      )}
      {store.get('username') != undefined &&
      store.get('roles').includes('ADMIN') ? (
        <Typography style={{ margin: 8 }} variant="h6" gutterBottom>
          Want to see all users?
          <Button
            variant="outlined"
            color="primary"
            href="/users_dashboard"
            style={{ textTransform: 'none', margin: 20 }}
          >
            See all users
          </Button>
        </Typography>
      ) : (
        ''
      )}
      {store.get('username') != undefined &&
      store.get('roles').includes('TEACHER') ? (
        <Typography style={{ margin: 8 }} variant="h6" gutterBottom>
          Want to see your exams?
          <Button
            variant="outlined"
            color="primary"
            href="/teacher_dashboard"
            style={{ textTransform: 'none', margin: 20 }}
          >
            See all exams
          </Button>
        </Typography>
      ) : (
        ''
      )}
      {store.get('username') != undefined ? (
        <Button
          variant="outlined"
          color="secondary"
          href="/"
          onClick={() => {
            store.clearAll()
          }}
          style={{ textTransform: 'none', margin: 20 }}
        >
          Log out
        </Button>
      ) : (
        ''
      )}
    </Layout>
  )
}

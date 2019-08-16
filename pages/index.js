import { Button } from '@material-ui/core'
import Layout from '../components/MyLayout.js'
import Typography from '@material-ui/core/Typography'

export default () => {
  return (
    <Layout>
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
    </Layout>
  )
}

import Layout from '../components/MyLayout.js'
import Typography from '@material-ui/core/Typography'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <Typography style={{ margin: 8 }} variant="h5" gutterBottom>
        You do not have enough access for that page 🧸
      </Typography>
    </SnackbarProvider>
  </Layout>
)

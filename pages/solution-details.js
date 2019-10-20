import Layout from '../components/MyLayout.js'
import SolutionDetails from '../components/Teacher/Submissions/SolutionDetails'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <SolutionDetails />
    </SnackbarProvider>
  </Layout>
)

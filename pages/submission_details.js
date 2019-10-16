import Layout from '../components/MyLayout.js'
import SubmissionDetails from '../components/Teacher/Submissions/SubmissionDetails'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <SubmissionDetails />
    </SnackbarProvider>
  </Layout>
)

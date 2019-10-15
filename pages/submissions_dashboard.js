import Layout from '../components/MyLayout.js'
import SubmissionsDashboard from '../components/Teacher/Submissions/SubmissionsDashboard'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <SubmissionsDashboard />
    </SnackbarProvider>
  </Layout>
)

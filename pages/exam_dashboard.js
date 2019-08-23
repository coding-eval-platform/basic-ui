import Layout from '../components/MyLayout.js'
import ExamDashboard from '../components/Teacher/Exercises/ExamDashboard.js'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <ExamDashboard />
    </SnackbarProvider>
  </Layout>
)

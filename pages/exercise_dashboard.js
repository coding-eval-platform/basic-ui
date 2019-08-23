import Layout from '../components/MyLayout.js'
import ExerciseDashboard from '../components/Teacher/TestCases/ExerciseDashboard.js'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <ExerciseDashboard />
    </SnackbarProvider>
  </Layout>
)

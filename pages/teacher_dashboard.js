import Layout from '../components/MyLayout.js'
import TeacherDashboard from '../components/Teacher/Exams/TeacherDashboard.js'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <TeacherDashboard />
    </SnackbarProvider>
  </Layout>
)

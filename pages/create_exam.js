import Layout from '../components/MyLayout.js'
import CreateExam from '../components/Exams/CreateExam.js'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <CreateExam />
    </SnackbarProvider>
  </Layout>
)

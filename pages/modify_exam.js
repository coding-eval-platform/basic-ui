import Layout from '../components/MyLayout.js'
import ModifyExam from '../components/Exams/ModifyExam.js'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <ModifyExam />
    </SnackbarProvider>
  </Layout>
)

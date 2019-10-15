import Layout from '../components/MyLayout.js'
import StudentLogin from '../components/Student/StudentLogin.js'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <StudentLogin />
    </SnackbarProvider>
  </Layout>
)

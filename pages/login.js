import Layout from '../components/MyLayout.js'
import LoginForm from '../components/Identity/LoginForm.js'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <LoginForm />
    </SnackbarProvider>
  </Layout>
)

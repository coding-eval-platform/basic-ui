import Layout from '../components/MyLayout.js'
import SignUpForm from '../components/Identity/SignUpForm.js'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <SignUpForm />
    </SnackbarProvider>
  </Layout>
)

import Layout from '../components/MyLayout.js'
import LTIRegistrationForm from '../components/Admin/LTIRegistrationForm.js'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <LTIRegistrationForm />
    </SnackbarProvider>
  </Layout>
)

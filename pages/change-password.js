import Layout from '../components/MyLayout.js'
import ChangePassword from '../components/Admin/ChangePassword.js'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <ChangePassword />
    </SnackbarProvider>
  </Layout>
)

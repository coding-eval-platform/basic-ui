import Layout from '../components/MyLayout.js'
import UsersDashboard from '../components/Admin/UsersDashboard'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <UsersDashboard />
    </SnackbarProvider>
  </Layout>
)

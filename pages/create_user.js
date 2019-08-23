import Layout from '../components/MyLayout.js'
import CreateUser from '../components/Admin/CreateUser.js'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <CreateUser />
    </SnackbarProvider>
  </Layout>
)

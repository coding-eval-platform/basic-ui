import Layout from '../components/MyLayout.js'
import ModifyUser from '../components/Admin/ModifyUser.js'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <ModifyUser />
    </SnackbarProvider>
  </Layout>
)

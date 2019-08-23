import Layout from '../components/MyLayout.js'
import CreateTestCase from '../components/TestCases/CreateTestCase.js'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <CreateTestCase />
    </SnackbarProvider>
  </Layout>
)

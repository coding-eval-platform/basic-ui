import Layout from '../components/MyLayout.js'
import ModifyTestCase from '../components/TestCases/ModifyTestCase.js'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <ModifyTestCase />
    </SnackbarProvider>
  </Layout>
)

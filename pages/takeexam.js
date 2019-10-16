import Layout from '../components/MyLayout.js'
import RubyExamExercise from '../components/Editors/RubyExamExercise.js'
import { SnackbarProvider } from 'notistack'
import Divider from '@material-ui/core/Divider'

export default () => (
  <Layout>
    <SnackbarProvider>
      <RubyExamExercise />
      <Divider style={{ marginTop: 40, marginBottom: 20 }} variant="middle" />
      <RubyExamExercise />
    </SnackbarProvider>
  </Layout>
)

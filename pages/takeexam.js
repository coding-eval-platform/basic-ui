import Layout from '../components/MyLayout.js'
import RubyExamExercise from '../components/Editors/RubyExamExercise.js'
import JavaExamExercise from '../components/Editors/JavaExamExercise.js'
import CExamExercise from '../components/Editors/CExamExercise.js'
import { SnackbarProvider } from 'notistack'
import Divider from '@material-ui/core/Divider'

export default () => (
  <Layout>
    <SnackbarProvider>
      <RubyExamExercise />
      <Divider style={{ marginTop: 40, marginBottom: 20 }} variant="middle" />
      <JavaExamExercise />
      <Divider style={{ marginTop: 40, marginBottom: 20 }} variant="middle" />
      <CExamExercise />
    </SnackbarProvider>
  </Layout>
)

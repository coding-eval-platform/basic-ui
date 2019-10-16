import Layout from '../components/MyLayout.js'
import RubyExamExercise from '../components/Editors/RubyExamExercise.js'
import JavaExamExercise from '../components/Editors/JavaExamExercise.js'
import ExamExercises from '../components/Student/ExamExercises.js'
import { SnackbarProvider } from 'notistack'
import Divider from '@material-ui/core/Divider'

export default () => (
  <Layout>
    <SnackbarProvider>
      <ExamExercises />
    </SnackbarProvider>
  </Layout>
)

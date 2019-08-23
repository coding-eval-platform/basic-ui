import Layout from '../components/MyLayout.js'
import CreateExercise from '../components/Exercises/CreateExercise.js'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <CreateExercise />
    </SnackbarProvider>
  </Layout>
)

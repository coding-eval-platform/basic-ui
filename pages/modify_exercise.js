import Layout from '../components/MyLayout.js'
import ModifyExercise from '../components/Exercises/ModifyExercise.js'
import { SnackbarProvider } from 'notistack'

export default () => (
  <Layout>
    <SnackbarProvider>
      <ModifyExercise />
    </SnackbarProvider>
  </Layout>
)

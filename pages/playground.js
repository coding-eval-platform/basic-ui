import Layout from '../components/MyLayout.js'
import RubyExercise from '../components/Editors/RubyExercise.js'
import JavaPlaygroundExercise from '../components/Editors/JavaPlaygroundExercise.js'
import CExercise from '../components/Editors/CExercise.js'

export default () => (
  <Layout>
      <RubyExercise />
      
      {/* <Divider/> */}

      <JavaPlaygroundExercise />

      {/* <Divider/> */}

      <CExercise />
  </Layout>
)
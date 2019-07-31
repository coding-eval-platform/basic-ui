import Layout from '../components/MyLayout.js'
import RubyPlaygroundExercise from '../components/Editors/RubyPlaygroundExercise.js'
import JavaPlaygroundExercise from '../components/Editors/JavaPlaygroundExercise.js'
import CPlaygroundExercise from '../components/Editors/CPlaygroundExercise.js'

export default () => (
  <Layout>
      <RubyPlaygroundExercise />

      <hr style={{margin: 50 }}/>
      
      <JavaPlaygroundExercise />

      <hr style={{margin: 50 }}/>

      <CPlaygroundExercise />
  </Layout>
)
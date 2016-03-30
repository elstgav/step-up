import mongoose from 'mongoose'
import config from '_/config'
// import dummyData from '../api/dummyData'

export default {
  init() {
    mongoose.connect(config.mongoURL, (error) => {
      if (error) {
        console.error('Please make sure Mongodb is installed and running!') // eslint-disable-line no-console
        throw error
      }
    })
  }
}
